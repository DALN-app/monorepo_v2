import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useState, useEffect } from "react";
import * as dfd from "danfojs";

import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'

import LOCAL_STORAGE from "./storage";

import config from "./config.json"
import {createApi, credentials, saveResult} from "./WeaveHelper";

export class ProcessingResult {
    constructor(output: string, error: string = null) {
        this.output = output;
        this.error = error;
    }

    output: string;
    error: string;
}

export default function Home() {
    const { address, isConnected } = useAccount();
    const { data, signMessage } = useSignMessage();

    const { connect } = useConnect({
        connector: new InjectedConnector(),
    })
    const { disconnect } = useDisconnect()

    const [content, setContent] = useState<string>(
        LOCAL_STORAGE.readObject("content") //This can be initialized with null, here we're reading content from the browser local storage
    );
    const [output, setOutput] = useState<string>();
    const [input, setInput] = useState<any>();
    const [writeResult, setWriteResult] = useState<any>();
    const [signature, setSignature] = useState<string>("");
    const [saveOnSignature, setSaveOnSignature] = useState<boolean>(false);

    //TODO: this is to be replaced with the actual API connection and reading data from the source
    const readFile = (file: any) => new Promise((resolve: any, reject: any) => {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

    const process = (): ProcessingResult => {
        try {
            if (content) {
                const df = new dfd.DataFrame(Object.values(JSON.parse(content)));
                //df.print();
                const grouped = df.groupby(['date']).col(['amount']).sum();
                grouped.print();
                const output = dfd.toJSON(grouped);
                return output ? new ProcessingResult(JSON.stringify((output))) : new ProcessingResult(null, "No result");
            } else {
                return new ProcessingResult(null, "JSON data not set");
            }
        } catch (e) {
            return new ProcessingResult(null, e.toString());
        }
    };

    const store = async (sign : any) =>  {
        const metadata = {
            ts: new Date().valueOf(),
            plaidAccount: "dummy"
        };

        const {pub, nodeApi, credentials} = await createApi(config.auth_chain, config.node, address, sign);
        if (credentials != null) {
            saveResult(pub, nodeApi, credentials, config, address, content, metadata).then((r) => {
                console.log(r);
                if (r) {
                    setWriteResult(r.data);
                }
            })
        }
    }

    const save = async () => {
        const sign = (message : string) => signMessage({ message });
        setSaveOnSignature(true);
        store(sign);
    }

    useEffect(() => {
        if (saveOnSignature) {
            const sign = (message: string) => data;
            setSaveOnSignature(false);
            store(sign);
        }
        //needed because of how wagmi's signMessage works, can be simplified if using ethers or other libs directly by just calling store() with the signature
    }, [ data ]);

    return (
        <div className={styles.container}>
          <Head>
            <title>Test App</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <main>
            <h1 className={styles.title}>
              Test App
            </h1>

            <div className={styles.grid}>
              <a className={styles.card + (!!content ? " " + styles.checked : "")}
                 onClick={() => input.click()}
              >
                <h3>Step 1</h3>
                  <p>Click here to load a JSON file</p>
                  <p>The file will not leave your browser</p>
                  <input
                      type="file" name="file"
                      style={{display: "none"}}
                      ref={input => setInput(input)}
                      onChange={(e) => {
                          readFile(e.target.files?.[0])
                              .then((content: string) => {
                                  console.log(content);
                                  //This stores the data in the current session
                                  setContent(content);

                                  //If needed for later use, it could be saved in the browser local storage
                                  LOCAL_STORAGE.saveObject("content", content);
                              });
                      }}
                  />
              </a>

              <a className={styles.card + (!!output ? " " + styles.checked : "")}
                 onClick={() => {
                     const result = process();
                     if (result?.error) {
                         //TODO: Error handling
                     } else {
                         setOutput(result.output);
                     }
                 }}
              >
                <h3>Step 2</h3>
                <p>Click to run the compute process locally</p>
              </a>

              <a className={styles.card + (isConnected ? " " + styles.checked : "")}
                onClick={() => {
                    if (!isConnected) {
                        connect()
                    }
                }}
              >
                <h3>Step 3</h3>
                <p>Click to connect Metamask</p>
                <p>{address ? address.substring(0, 6) + "..." + address.substring(address.length - 5) : ""}</p>
              </a>

                <a className={styles.card + (writeResult ? " " + styles.checked : "")}
                   onClick={() => {
                       save();
                   }}
              >
                  <h3>Step 4</h3>
                  <p>Click to upload the result, signed and visible only in DALN backend</p>
              </a>
            </div>
          </main>

          <footer>
          </footer>

          <style jsx>{`
            main {
              padding: 5rem 0;
              flex: 1;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
            }
            footer {
              width: 100%;
              height: 100px;
              border-top: 1px solid #eaeaea;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            footer img {
              margin-left: 0.5rem;
            }
            footer a {
              display: flex;
              justify-content: center;
              align-items: center;
              text-decoration: none;
              color: inherit;
            }
            code {
              background: #fafafa;
              border-radius: 5px;
              padding: 0.75rem;
              font-size: 1.1rem;
              font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
                DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
            }
          `}</style>

          <style jsx global>{`
            html,
            body {
              padding: 0;
              margin: 0;
              font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
                Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
                sans-serif;
            }
            * {
              box-sizing: border-box;
            }
          `}
          </style>
        </div>
  )
}
