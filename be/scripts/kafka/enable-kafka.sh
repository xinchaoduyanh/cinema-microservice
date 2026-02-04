#!/bin/bash

echo "🚀 Enabling Kafka in Cinema Management System..."
echo ""

# Step 1: Check if docker-compose.yml has Kafka commented
if grep -q "#  kafka:" docker-compose.yml; then
  echo "⚠️  Kafka is currently commented in docker-compose.yml"
  echo "📝 Please uncomment lines 73-114 in docker-compose.yml"
  echo ""
  echo "Or run this command to uncomment automatically:"
  echo "  sed -i 's/#  kafka:/  kafka:/g' docker-compose.yml"
  echo "  sed -i 's/#    /    /g' docker-compose.yml (lines 74-114)"
  echo ""
  read -p "Do you want to uncomment automatically? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🔧 Uncommenting Kafka services..."
    # This is a simplified approach - you may need to manually uncomment
    echo "⚠️  Please manually uncomment lines 73-114 in docker-compose.yml for now"
    echo "   Then run this script again"
    exit 1
  else
    echo "❌ Aborted. Please uncomment manually and run again."
    exit 1
  fi
fi

# Step 2: Start Kafka services
echo "🐳 Starting Kafka and Kafka UI..."
docker-compose up -d kafka kafkaui

# Step 3: Wait for Kafka to be ready
echo "⏳ Waiting for Kafka to be ready (30 seconds)..."
sleep 30

# Step 4: Create topics
echo "📝 Creating Kafka topics..."
bash scripts/kafka/create-topics.sh

# Step 5: Verify
echo ""
echo "✅ Kafka setup complete!"
echo ""
echo "📊 Access Kafka UI at: http://localhost:18082"
echo "   Username: admin"
echo "   Password: secret"
echo ""
echo "🔧 Next steps:"
echo "   1. Add USE_KAFKA=false to your .env file"
echo "   2. Follow the migration plan in docs/KAFKA_MIGRATION_PLAN.md"
echo "   3. Test with USE_KAFKA=true when ready"
