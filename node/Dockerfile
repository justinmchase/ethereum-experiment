FROM kunstmaan/ethereum-geth
MAINTAINER justinmchase

WORKDIR /root

# Generate and store a wallet password
RUN echo `date +%s | sha256sum | base64 | head -c 32` > ~/.pwd
RUN geth --dev --password ~/.pwd account new > ~/.account

CMD geth \
    --rpc --rpcaddr "0.0.0.0" --rpccorsdomain "*" --rpcapi "db,eth,net,web3,personal" \
    --dev \
    --password .pwd \
    --unlock 0 \
    --mine --minerthreads 1 \
    --extradata "justinmchase"

EXPOSE 8545
EXPOSE 30303
