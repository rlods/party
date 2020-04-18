FROM golang:1.14.2

WORKDIR /go/src/api
COPY services/api .

RUN go get github.com/githubnemo/CompileDaemon
RUN go get -d -v ./...
RUN go install -v ./...

CMD ["/go/bin/api"]
