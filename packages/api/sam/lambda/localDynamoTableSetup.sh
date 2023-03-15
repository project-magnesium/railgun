#!/bin/bash

if [ "$1" = "clean" ]; then
EXISTING_TABLES=$(aws dynamodb list-tables --endpoint-url http://localhost:8000 | jq -r '.TableNames[]')
for table in $EXISTING_TABLES;
do aws dynamodb delete-table --table-name $table --endpoint-url http://localhost:8000 --no-cli-pager;
done
fi

for f in packages/api/sam/lambda/localDynamoTables/*;
do aws dynamodb create-table --cli-input-json file://$f --endpoint-url http://localhost:8000 --no-cli-pager;
done

echo "NOTE: It is normal for this command to fail if there are pre-existing tables. Use aws dynamodb list-tables --endpoint-url http://localhost:8000 to check if the non existing tables were created."