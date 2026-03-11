import { registerAs } from '@nestjs/config';
import * as dotenv from 'dotenv';
import path from 'path';

export const kafkaConfiguration = registerAs('kafka', () => {
  const envPath = path.resolve(process.cwd(), '.env');
  const envPathParent = path.resolve(process.cwd(), '../../.env');
  const envPathRoot = path.resolve(process.cwd(), '../../../.env');

  if (require('fs').existsSync(envPath)) {
    dotenv.config({ path: envPath });
  } else if (require('fs').existsSync(envPathParent)) {
    dotenv.config({ path: envPathParent });
  } else if (require('fs').existsSync(envPathRoot)) {
    dotenv.config({ path: envPathRoot });
  }

  console.log('[DEBUG-KAFKA-CONFIG] Loading Kafka config. KAFKA_BROKERS:', process.env.KAFKA_BROKERS);
  return {
  brokers: process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(',') : [],
  heartbeatInterval: process.env.KAFKA_HEARTBEAT_INTERVAL || 2000,
  sessionTimeout: process.env.KAFKA_SESSION_TIMEOUT || 60000,
  saslEnabled: process.env.KAFKA_SASL_ENABLED === 'true',
  saslMechanism: process.env.KAFKA_SASL_MECHANISM || 'scram-sha-256',
  saslUsername: process.env.KAFKA_SASL_USERNAME || 'root',
  saslPassword: process.env.KAFKA_SASL_PASSWORD || 'secret',
  };
});
