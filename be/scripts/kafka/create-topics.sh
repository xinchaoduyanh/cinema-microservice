#!/bin/bash

KAFKA_CONTAINER="nest_turbo_kafka"

echo "🚀 Creating Kafka topics..."

# Saga Events
echo "📝 Creating saga topics..."
docker exec $KAFKA_CONTAINER /opt/kafka/bin/kafka-topics.sh --create \
  --topic saga.booking.started \
  --partitions 3 \
  --replication-factor 1 \
  --bootstrap-server localhost:9092 \
  --if-not-exists

docker exec $KAFKA_CONTAINER /opt/kafka/bin/kafka-topics.sh --create \
  --topic saga.booking.completed \
  --partitions 3 \
  --replication-factor 1 \
  --bootstrap-server localhost:9092 \
  --if-not-exists

docker exec $KAFKA_CONTAINER /opt/kafka/bin/kafka-topics.sh --create \
  --topic saga.booking.failed \
  --partitions 3 \
  --replication-factor 1 \
  --bootstrap-server localhost:9092 \
  --if-not-exists

# Service Events
echo "📝 Creating service topics..."
docker exec $KAFKA_CONTAINER /opt/kafka/bin/kafka-topics.sh --create \
  --topic user.created \
  --partitions 3 \
  --replication-factor 1 \
  --bootstrap-server localhost:9092 \
  --if-not-exists

docker exec $KAFKA_CONTAINER /opt/kafka/bin/kafka-topics.sh --create \
  --topic user.updated \
  --partitions 3 \
  --replication-factor 1 \
  --bootstrap-server localhost:9092 \
  --if-not-exists

docker exec $KAFKA_CONTAINER /opt/kafka/bin/kafka-topics.sh --create \
  --topic notification.email.send \
  --partitions 3 \
  --replication-factor 1 \
  --bootstrap-server localhost:9092 \
  --if-not-exists

docker exec $KAFKA_CONTAINER /opt/kafka/bin/kafka-topics.sh --create \
  --topic notification.sms.send \
  --partitions 3 \
  --replication-factor 1 \
  --bootstrap-server localhost:9092 \
  --if-not-exists

# Dead Letter Queue
echo "📝 Creating DLQ topic..."
docker exec $KAFKA_CONTAINER /opt/kafka/bin/kafka-topics.sh --create \
  --topic dlq.failed-events \
  --partitions 1 \
  --replication-factor 1 \
  --bootstrap-server localhost:9092 \
  --if-not-exists

echo ""
echo "✅ All topics created successfully!"
echo ""
echo "📊 Listing all topics:"
docker exec $KAFKA_CONTAINER /opt/kafka/bin/kafka-topics.sh --list --bootstrap-server localhost:9092
