import { Seeder } from '@mikro-orm/seeder';
import { EntityManager } from '@mikro-orm/core';
import { Cinema } from '../../data-access/cinema/cinema.entity';
import { Room } from '../../data-access/room/room.entity';
import { Seat, SeatType } from '../../data-access/seat/seat.entity';

export class CinemaSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    // 1. Seed Cinemas với tọa độ thật (Ví dụ tại TP.HCM)
    const cinemasData = [
      { 
        name: "AESTHETIX Grand Central", 
        address: "Lê Lợi, Bến Nghé, Quận 1, TP. Hồ Chí Minh", 
        description: "Flagship luxury cinema in the heart of Saigon.",
        latitude: 10.7769,
        longitude: 106.7009
      },
      { 
        name: "AESTHETIX Landmark", 
        address: "Vinhomes Central Park, Bình Thạnh, TP. Hồ Chí Minh", 
        description: "Modern cinema experience with high-tech screens.",
        latitude: 10.7951,
        longitude: 106.7218
      }
    ];

    for (const cData of cinemasData) {
      let cinema = await em.findOne(Cinema, { name: cData.name });
      if (!cinema) {
        cinema = em.create(Cinema, cData);
      } else {
        // Cập nhật tọa độ nếu rạp đã tồn tại
        Object.assign(cinema, { latitude: cData.latitude, longitude: cData.longitude });
      }

      // 2. Seed Rooms
      const roomsData = ["Auditorium 1", "Auditorium 2", "IMAX Screen"];
      for (const rName of roomsData) {
        let room = await em.findOne(Room, { name: rName, cinema: cinema.id });
        if (!room) {
          room = em.create(Room, { name: rName, cinema });
          
          // 3. Seed Seats 5x5
          const rows = ['A', 'B', 'C', 'D', 'E'];
          const cols = 5;
          for (const row of rows) {
            for (let col = 1; col <= cols; col++) {
              em.create(Seat, {
                row,
                column: col,
                type: row === 'E' ? SeatType.VIP : SeatType.STANDARD,
                room
              });
            }
          }
        }
      }
    }

    await em.flush();
  }
}
