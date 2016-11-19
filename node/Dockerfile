FROM kunstmaan/ethereum-geth
MAINTAINER justinmchase

WORKDIR /root

# Generate and store a wallet password
RUN echo `date +%s | sha256sum | base64 | head -c 32` > ~/.pwd
RUN geth --dev --password ~/.pwd account new > ~/.account

CMD geth \
    --dev \
    --unlock 0 \
    --password .pwd \
    --mine --minerthreads 1 \
    --rpc --rpccorsdomain "*" --rpcapi "db,eth,net,web3,personal" \
    --extradata "justinmchase"
