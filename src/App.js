import logo from './logo.svg';
import './App.css';
import bananacontract from './MyNFTLiquidityPool.json';
import contract from './WhaleToken.json'
import { ethers } from 'ethers'; 
import NFT from './nft';
import { useState ,useEffect} from 'react';
import Loader from 'react-loader-advanced'
import CircularProgress from "@material-ui/core/CircularProgress";

const spinner = <span><CircularProgress style={{'color': 'yellow'}}/></span>;

const BigNumber = require('bignumber.js');


const { ethereum } = window;
const stakeAddress = "0x823b30c16b4E978494CE21dFc2896b4dE3242471";
const bananaabi = bananacontract.abi;
const contractaddress= "0x76f3998804fc80D62439CE6991c63790c462DD7c"
const abi=contract.abi


function App() {
  const [json,setjson]=useState([])
  const [status , setStatus]=useState('CONNECT WALLET')
  const [account,setCurrentAccount]=useState()
  const [loading,setload]=useState(false)
  const [seleted,setselected]=useState([])
  const [showaddtoken, setshowadd]=useState(false)
  const [staking,setstaking]=useState([])
  const [seletedstaking,setselectedstaking]=useState([])
  const [clear,setclear]=useState(false)

  useEffect(()=>{
    checkWalletIsConnected()
  },[])
  useEffect(()=>{
    console.log(seletedstaking)
  },[seletedstaking])
  const addtoken = ()=>{
    const params = {
      type: 'ERC20',
      options: {
        address: '0x823b30c16b4E978494CE21dFc2896b4dE3242471',
        symbol: 'MBA',
        decimals: 18,
        image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3701.png'
      }
    }
    
    window.ethereum.request({ method: 'wallet_watchAsset', params })
      // .then(() => setLog([...log, 'Success, Token added!']))
      // .catch((error) => setLog([...log, `Error: ${error.message}`]))
  }

  const checkWalletIsConnected = async () => {
    if (!ethereum) {
      setStatus("DOWNLOAD METAMASK");
      return;
    } else {
        setStatus("CONNECT WALLET");
        const accounts = await ethereum.request({ method: 'eth_accounts' }).then().catch((err)=>{});
        if (accounts.length !== 0) {
          console.log('asdfas')
          setStatus("show nft")
          setshowadd(true)
          const account = accounts[0];
          setCurrentAccount(account);
        } else {
          connectWalletHandler()
        }
      
    }
  }

    const connectWalletHandler = async () => {
      const { ethereum } = window;
  
      if (!ethereum) {
        setStatus("DOWNLOAD METAMASK");
      }else
      {
          const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
          setCurrentAccount(accounts[0]);
          setStatus("show nft")
      }
    }

  const send =async ()=>{
    console.log("send")
    console.log(seleted)
    const provider1 = new ethers.providers.Web3Provider(ethereum);
    const signer1 = provider1.getSigner();
    const Contract = new ethers.Contract(contractaddress, abi,signer1);
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const StakingContract = new ethers.Contract(stakeAddress, bananaabi,signer);
    let temp=json;
    let stakingnft=staking;
    for(let i = 0;i<json.length;i++)
    {
      for(let j=0;j<seleted.length;j++)
      {
        if(seleted[j]==json[i].slice(82,-4))
        {
          stakingnft.push(json[i])
        }
      }
    }
    temp = temp.filter(item => !stakingnft.includes(item))
    setselected([])

    console.log(temp,stakingnft)
    setjson(temp)
    setstaking(stakingnft)
    // for(let i = 0;i<seleted.length;i++)
    //   {
    //     await Contract.approve(stakeAddress,seleted[i])
    //     // await StakingContract.deposit(account,seleted[i])
    //   }
    setclear(true)
  }

  const withdraw=()=>{
    let temp=staking;
    let withdrwanft=json;
    for(let i = 0;i<staking.length;i++)
    {
      for(let j=0;j<seletedstaking.length;j++)
      {
        if(seletedstaking[j]==staking[i].slice(82,-4))
        {
          withdrwanft.push(staking[i])
        }
      }
    }
    temp = temp.filter(item => !withdrwanft.includes(item))
    setselectedstaking([])

    console.log(temp,withdrwanft)
    setjson(withdrwanft)
    setstaking(temp)
    setclear(!clear)
  }
  async function test( ){
    
    const provider1 = new ethers.providers.Web3Provider(ethereum);
    const signer1 = provider1.getSigner();
    const Contract = new ethers.Contract(contractaddress, abi,signer1);
    setload(true)
    const accounts = await ethereum.request({ method: 'eth_accounts' }).then().catch((err)=>{});
    let balance
     await Contract.balanceOf(accounts[0]).then((result)=>{balance=BigNumber(result._hex)});
    let temp=[]
    for (let i = 0; i < balance; i++) {
      let id=await Contract.tokenOfOwnerByIndex(accounts[0], i)
      temp.push(`https://whales.mypinata.cloud/ipfs/QmaxLqrasDB5k46sPei1EWDKU5b1Wh1K7o9hsfL8LQiZ2N/${id}.png`)
      console.log('i')
    }
    setjson(temp)
    console.log(temp)
    setload(!clear)
  }

  const shownft=()=>{
    if(status=="show nft") test()
    else if (status=="DOWNLOAD METAMASK") window.location.href='https://metamask.io/download.html'
    else connectWalletHandler()
  }
  const receive=async (data)=>{
    await setselected([...seleted,data])
  }
  const deldata=async (data)=>{
    await setselected(seleted.filter(item=>item!=data))
  }
  const receivestaking=async (data)=>{
    await setselectedstaking([...seletedstaking,data])
  }
  const deldatastaking=async (data)=>{
    await setselectedstaking(seletedstaking.filter(item=>item!=data))
  }


  return (
    <div className="App">
      <Loader backgroundStyle={{borderRadius:10}} show={loading} message={spinner}>
        <header className="App-header">
        <div id="container">
                <div id="label">Staking nfts</div>
                <div className='nfts row'>
                  {
                    staking.length!=0?
                      staking.map(data=>{
                          return(<NFT data={data} receive={receivestaking} deldata={deldatastaking} clear={clear}/>)
                        }):
                        <></>
                  }
                </div>
                {
                  seletedstaking.length!=0? 
                  <button onClick={withdraw}>Withdraw NFT</button>
                  :
                  <></>
                }
        </div>
        
          {/* <img src={logo} className="App-logo" alt="logo" /> */}
          <button onClick={shownft}>{status}</button>
            <div id="container">
                  <div id="label">nfts in your wallet</div>
                <div className='nfts row'>
                  {
                  json.length!=0?
                      json.map(data=>{
                        return(<NFT data={data} receive={receive} deldata={deldata} clear={clear}/>)
                      }):
                      <></>
                  }
                </div>
                
                {
                  seleted.length!=0? 
                  <button onClick={send}>Send NFT</button>
                  :
                  <></>
                }
            </div>
            <button disabled={!showaddtoken} onClick={addtoken}>ADD BNANA</button>
          <div>
            
          </div>
        </header>
      </Loader>
      
      
    </div>
  );
}

export default App;
