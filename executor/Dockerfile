FROM maven:3.8.4-openjdk-17-slim AS build

WORKDIR /app

COPY . .

RUN #mvn clean package -DskipTests=true

FROM openjdk:17-slim

RUN ulimit -n 65536

WORKDIR /app

#COPY --from=build /app/target/executor.jar app.jar

RUN mkdir code-execution

COPY . ../code-execution

RUN apt-get update && \
    apt-get -qy full-upgrade && \
    apt-get install -qy curl && \
    curl -sSL https://get.docker.com/ | sh

#RUN apt-get update
#
#RUN apt-get install -y ca-certificates curl
#
#RUN install -m 0755 -d /etc/apt/keyrings
#
#RUN curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
#
#RUN chmod a+r /etc/apt/keyrings/docker.asc
#
#RUN echo \
#      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
#      $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
#      tee /etc/apt/sources.list.d/docker.list > /dev/null
#
#RUN apt-get update
#
#RUN apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

#RUN systemctl start docker
#
#RUN systemctl enable docker
#
#RUN docker build -t cpp-code-runner ./code-execution/cpp
#
#RUN docker build -t java-code-runner ./code-execution/java
#
#RUN docker build -t karel-code-runner ./code-execution/karel

CMD ["sleep", "1000000"]
#CMD ["java", "-jar", "app.jar"]