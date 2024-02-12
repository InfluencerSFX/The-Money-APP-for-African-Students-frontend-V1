import { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const QrScanner = ({ setScanWalletAddress }) => {
  useEffect(() => {
    const success = (result) => {
      setScanWalletAddress(result);
      scanner.clear()
    };


    const scanner = new Html5QrcodeScanner("reader", {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 10,
    });

    scanner.render(success);

  
    return () => {
      scanner.clear();
    };
  }, [setScanWalletAddress]);

  return <div id="reader"></div>;
};

export default QrScanner;
