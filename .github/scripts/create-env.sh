#!/usr/bin/env bash
# Create .env file from GitHub secrets

json_secrets_str=$1
env_filename=".env.production"

jq -r 'to_entries|map("\(.key)=\(.value|tostring)")|.[]' <<< "$json_secrets_str" > "$env_filename"