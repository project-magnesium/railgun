# Remove custom shell prompt to speed up contianer
git config --global codespaces-theme.hide-info 1 && git config --global codespaces-theme.hide-status 1 && git config --global codespaces-theme.hide-dirty 1;

# Copy example env files if they don't exist
cp -n packages/api/env.json.example packages/api/env.json;
cp -n apps/.env.example apps/.env;

# Install all monorepo dependencies
yarn install --silent;

# Check if dynamo-local is running. If not, start it.
if [ ! "$(docker ps -a -q -f name=dynamo-local)" ]; then
    if [ "$(docker ps -aq -f status=exited -f name=dynamo-local)" ]; then
        # cleanup
        docker rm dynamo-local
    fi
    # run container
    docker run -d -p 8000:8000 --name dynamo-local amazon/dynamodb-local;
fi
docker container start dynamo-local;
bash packages/api/sam/lambda/localDynamoTableSetup.sh;