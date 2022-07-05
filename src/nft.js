import React,{useEffect, useState} from "react";


export default function NFT({data,receive,deldata,clear}) {
  const [clicked,setclicked]=useState(true)
  const [cls, setCls] = useState("card ");
  // 
  useEffect(()=>{
     setCls("card")
  },[clear])
  return (
    <div className="col">
      {
        data?
        <div class={cls} value={data.slice(82,-4)} onClick={e=>{
                      if(clicked){
                          receive(e.currentTarget.attributes['value'].value)
                          setCls("card cardselected")
                          setclicked(!clicked)
                      }else {
                        setCls("card")
                        deldata(e.currentTarget.attributes['value'].value)
                        setclicked(!clicked)
                      }
                        
              }}>
          
          <img class="card-img-top" src={data} alt="Card image"></img>
          <div class="card-img-overlay">
            <h4 class="card-title card-id">#{data.slice(82,-4)}</h4>
          </div>
          
  
      </div>
      :
      <></>
      }
    </div>
    
  );
}
