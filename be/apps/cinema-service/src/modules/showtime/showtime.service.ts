import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { RedisService } from '@app/core';
import { Showtime } from '../../data-access/showtime/showtime.entity';
import { ShowtimeSeat, ShowtimeSeatStatus } from '../../data-access/showtime-seat/showtime-seat.entity';
import { Room } from '../../data-access/room/room.entity';
import { BaseRepository } from '../../data-access/base.repository';
import { CreateShowtimeDto, UpdateShowtimeDto } from './showtime.dto';

const SEAT_LOCK_TTL = 300; // 5 minutes in seconds

@Injectable()
export class ShowtimeService {
  constructor(
    @InjectRepository(Showtime)
    private readonly showtimeRepository: BaseRepository<Showtime>,
    @InjectRepository(Room)
    private readonly roomRepository: BaseRepository<Room>,
    @InjectRepository(ShowtimeSeat)
    private readonly showtimeSeatRepository: BaseRepository<ShowtimeSeat>,
    private readonly redisService: RedisService,
  ) {}

  async lockSeats(showtimeId: string, seatIds: string[], bookingId: string) {
    const showtime = await this.showtimeRepository.findOneOrFail(showtimeId);
    
    // 1. Dùng Distributed Lock trên Redis để tránh tranh chấp khi nhiều người cùng lock 1 ghế
    const lockKey = `lock:showtime:${showtimeId}:seats`;
    const acquired = await this.redisService.acquireLock(lockKey, bookingId, 10); // Khóa trong 10s để xử lý DB
    
    if (!acquired) {
      throw new Error('Hệ thống đang bận, vui lòng thử lại sau giây lát');
    }

    try {
      // 2. Kiểm tra xem có ghế nào đã bị LOCK (chưa hết hạn) hoặc BOOKED không
      const now = new Date();
      const expiryThreshold = new Date(now.getTime() - SEAT_LOCK_TTL * 1000);

      const existingSeats = await this.showtimeSeatRepository.find({
        showtime: showtimeId,
        seat: { $in: seatIds },
      });

      for (const seat of existingSeats) {
        if (seat.status === ShowtimeSeatStatus.BOOKED) {
          throw new Error(`Ghế ${seat.id} đã được đặt thành công bởi người khác`);
        }
        if (seat.status === ShowtimeSeatStatus.LOCKED && seat.lockedAt && seat.lockedAt > expiryThreshold) {
          throw new Error(`Ghế ${seat.id} đang được giữ bởi người khác`);
        }
      }

      // 3. Thực hiện Lock ghế (Cập nhật hoặc tạo mới)
      const seatUpdates = [];
      for (const seatId of seatIds) {
        let showtimeSeat = existingSeats.find(s => s.seat.id === seatId);
        
        if (!showtimeSeat) {
          showtimeSeat = new ShowtimeSeat();
          showtimeSeat.showtime = showtime;
          showtimeSeat.seat = seatId as any;
        }

        showtimeSeat.status = ShowtimeSeatStatus.LOCKED;
        showtimeSeat.bookingId = bookingId;
        showtimeSeat.lockedAt = now;
        seatUpdates.push(showtimeSeat);
      }

      await this.showtimeSeatRepository.getEntityManager().persistAndFlush(seatUpdates);

      return { 
        success: true, 
        expiresInSeconds: SEAT_LOCK_TTL,
        lockedAt: now
      };
    } finally {
      // 4. Giải phóng Distributed Lock
      await this.redisService.releaseLock(lockKey, bookingId);
    }
  }

  async unlockSeats(showtimeId: string, seatIds: string[]) {
    // Chỉ unlock những ghế đang trạng thái LOCKED
    const seats = await this.showtimeSeatRepository.find({
      showtime: showtimeId,
      seat: { $in: seatIds },
      status: ShowtimeSeatStatus.LOCKED
    });

    for (const seat of seats) {
      await this.showtimeSeatRepository.getEntityManager().remove(seat);
    }

    await this.showtimeSeatRepository.getEntityManager().flush();
    return { success: true };
  }

  async bookSeats(showtimeId: string, seatIds: string[], bookingId: string) {
    const seats = await this.showtimeSeatRepository.find({
      showtime: showtimeId,
      seat: { $in: seatIds },
      bookingId
    });

    for (const seat of seats) {
      seat.status = ShowtimeSeatStatus.BOOKED;
    }

    await this.showtimeSeatRepository.getEntityManager().flush();
    return { success: true };
  }

  async create(createShowtimeDto: CreateShowtimeDto) {
    const room = await this.roomRepository.findOneOrFail(createShowtimeDto.roomId);
    const showtime = new Showtime(createShowtimeDto);
    showtime.room = room;
    await this.showtimeRepository.getEntityManager().persistAndFlush(showtime);
    return showtime;
  }

  async findAll() {
    return this.showtimeRepository.findAll({ populate: ['room', 'room.cinema'] });
  }

  async findByRoom(roomId: string) {
    return this.showtimeRepository.find({ room: roomId });
  }

  async findByMovie(movieId: string) {
    return this.showtimeRepository.find({ movieId }, { populate: ['room', 'room.cinema'] });
  }

  async findOne(id: string) {
    return this.showtimeRepository.findOneOrFail(id, { populate: ['room', 'room.cinema'] });
  }

  async update(id: string, updateShowtimeDto: UpdateShowtimeDto) {
    const showtime = await this.findOne(id);
    if (updateShowtimeDto.roomId) {
      const room = await this.roomRepository.findOneOrFail(updateShowtimeDto.roomId);
      showtime.room = room;
    }
    Object.assign(showtime, updateShowtimeDto);
    await this.showtimeRepository.getEntityManager().flush();
    return showtime;
  }

  async remove(id: string) {
    const showtime = await this.findOne(id);
    await this.showtimeRepository.getEntityManager().removeAndFlush(showtime);
    return { success: true };
  }
}
