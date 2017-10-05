
var bitcore = require('bitcore-lib');
var Message = require('bitcore-message');
console.log('Bitcore Lib:', bitcore, '\n\n');

var TEST_SEND = false;

// Try to use this private keys for testing
var pvKeys = [
  "KzSAwJttccZeCkcL6akGFthCBG5PgQwPQY2YP6vuAWX1tKmwLSnL",
  "KwEHTz121iQe385m57pYwiYYvq7YhVxYqerauiERgtY1Qam6qL97",
  "L33nscBVZuXkQFmFVDYWX5wJksTuJLfNHRZbAFio2dw8ybidsrBk",
  "L3LVKXuDMgKW8yYCKmD951T9WgRgdxshg8iYEzx5FN8uVuLQwwgk",
  "L4XtFC3tdmgkVtpbjnchheGQRefaYxdLxCw8smrkJvMMfd5jwkRC",
  "KxhqzYQwbak3x518dUTDhBUybRYXLq6MWHzfhJK2b5obfLbTxnUw",
  "KxmCS6gocupi6TQXMedbbccWwFfpAcLGwjzJD87e1bpnMytgHnUJ",
  "KzpoWosHW4WDhBE49uG6hRtZcr4WzywrsVNJKt3skvBYsP9mWmaf",
  "KytrYsrB9SmzuYTeGijusBqRijJVnRPnQEfy3P7ZzpmU4oAnQS9a",
  "Ky2YYMktoshWQo4HfZggUMdipQ1SpVc5RFFUZVbZPxsfcjrX35oW"
];
console.log('Private keys to use (WIF format):', pvKeys);

var privateKey = new bitcore.PrivateKey.fromWIF(pvKeys[0]);
var address = new bitcore.Address(privateKey.toPublicKey(), bitcore.Networks.testnet);
console.log('Main testnet address', address.toString());

var signature = Message('hello, world').sign(privateKey);
var address = address.toString();
var verified = Message('hello, world').verify(address, signature);

console.log('Signature', signature, 'from', address, 'is', verified, '\n\n');

// Get testnet info
console.log('Getting testnet info..');
$.get('https://test-insight.bitpay.com/api/info', function(response) {
  console.log('BTC Testnet Info', response, '\n\n');
});

// Get balance of address
console.log('Getting address balance..');
$.get('https://test-insight.bitpay.com/api/addr/mpCX4JLdCNeUDjf5sfrsyQArBHrcVDDuib/balance', function(response) {
  console.log('mpCX4JLdCNeUDjf5sfrsyQArBHrcVDDuib Balance', response, '\n\n');
});

// Get txs of address
console.log('Getting address txs..');
$.get('https://test-insight.bitpay.com/api/txs/?address=mpCX4JLdCNeUDjf5sfrsyQArBHrcVDDuib', function(response) {
  console.log('mpCX4JLdCNeUDjf5sfrsyQArBHrcVDDuib Transactions', response, '\n\n');
});

if (TEST_SEND){

  //////////////////////// Build a bitcoin transaction ////////////////////////
  var toAddress = bitcore.Address(
    bitcore.PrivateKey.fromWIF(pvKeys[1]).toPublicKey(),
    bitcore.Networks.testnet
  );
  console.log('To address:',toAddress.toString());
  // Get the unspent outputs of address
  console.log('Getting address unspents..');
  $.get('https://test-insight.bitpay.com/api/addr/mpCX4JLdCNeUDjf5sfrsyQArBHrcVDDuib/utxo', function(response) {
    console.log('mpCX4JLdCNeUDjf5sfrsyQArBHrcVDDuib unspents', response, '\n\n');

    var bitcoreUnspents = response;

    console.log('Bitcore unspents:', bitcoreUnspents, '\n\n');

    var transaction = new bitcore.Transaction()
      .from(bitcoreUnspents)          // Feed information about what unspent outputs one can use
      .to(toAddress.toString(), 10000)  // Add an output with the given amount of satoshis
      .change(address)      // Sets up a change address where the rest of the funds will go
      .sign(privateKey)     // Signs all the inputs it can

    console.log('Bitcore transaction:', transaction);
    console.log('Bitcore transaction hex:', transaction.serialize(), '\n\n');

    $.post("https://test-insight.bitpay.com/api/tx/send", { "rawtx": transaction.serialize() } , function(txResponse) {
      console.log('Transaction push response:',txResponse)
    });

  });

  /////////////////////////////////////////////////////////////////////////////

}
