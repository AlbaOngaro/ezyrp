FROM ubuntu:latest

RUN apt-get update
RUN apt-get install -y curl netcat

RUN curl -sSf https://install.surrealdb.com | sh

EXPOSE 8080

COPY entrypoint.sh schema.surql /
RUN chmod +x ./entrypoint.sh

ENTRYPOINT [ "./entrypoint.sh" ]