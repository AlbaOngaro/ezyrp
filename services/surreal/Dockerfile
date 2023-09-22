FROM ubuntu:latest

RUN apt-get update
RUN apt-get install -y curl

RUN curl -sSf https://install.surrealdb.com | sh

EXPOSE 8080

CMD surreal start --bind 0.0.0.0:8080 --allow-all --auth --user $SURREAL_USER --pass $SURREAL_PASS --log debug file://data/srdb.db