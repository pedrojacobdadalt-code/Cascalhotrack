import { useState, useEffect, useRef } from "react";

// ── CONSTANTES ───────────────────────────────────────────────────
const JAZIDA = { nome: "Jazida Central", lat: -15.7801, lng: -47.9292 };

const USUARIOS = [
  { id:1, nome:"Gestor",         login:"gestor",      senha:"1234", perfil:"gestor"    },
  { id:2, nome:"Apontador",      login:"apontador",   senha:"1234", perfil:"apontador" },
  { id:3, nome:"João Silva",     login:"motorista1",  senha:"1234", perfil:"motorista", caminhaoId:1 },
  { id:4, nome:"Carlos Pereira", login:"motorista2",  senha:"1234", perfil:"motorista", caminhaoId:2 },
  { id:5, nome:"Maria Santos",   login:"motorista3",  senha:"1234", perfil:"motorista", caminhaoId:3 },
];

const CAMINHOES_INIT = [
  { id:1, placa:"ABC-1234", motorista:"João Silva",     freteiro:"Transportes Silva",   volumeM3:12, whatsapp:"65999990001", cpfCnpj:"", telefone:"" },
  { id:2, placa:"DEF-5678", motorista:"Carlos Pereira", freteiro:"Pereira Fretamento",  volumeM3:14, whatsapp:"65999990002", cpfCnpj:"", telefone:"" },
  { id:3, placa:"GHI-9012", motorista:"Maria Santos",   freteiro:"Santos & Cia",        volumeM3:10, whatsapp:"65999990003", cpfCnpj:"", telefone:"" },
];

const DESTINOS_INIT = [
  { id:1, nome:"Fazenda Boa Vista",  distanciaM:2500  },
  { id:2, nome:"Obra Centro",        distanciaM:8000  },
  { id:3, nome:"Condomínio Norte",   distanciaM:5000  },
  { id:4, nome:"Sítio São João",     distanciaM:12000 },
];

const TABELA_INIT = [
  { faixaLabel:"50 a 400 m",      mMin:50,   mMax:400,   valorM3xM:3.62  },
  { faixaLabel:"400 a 600 m",     mMin:400,  mMax:600,   valorM3xM:3.88  },
  { faixaLabel:"600 a 800 m",     mMin:600,  mMax:800,   valorM3xM:4.08  },
  { faixaLabel:"800 a 1000 m",    mMin:800,  mMax:1000,  valorM3xM:4.33  },
  { faixaLabel:"1000 a 2000 m",   mMin:1000, mMax:2000,  valorM3xM:5.62  },
  { faixaLabel:"2000 a 3000 m",   mMin:2000, mMax:3000,  valorM3xM:6.92  },
  { faixaLabel:"3000 a 5000 m",   mMin:3000, mMax:5000,  valorM3xM:8.09  },
  { faixaLabel:"5000 a 7500 m",   mMin:5000, mMax:7500,  valorM3xM:8.74  },
  { faixaLabel:"7500 a 10000 m",  mMin:7500, mMax:10000, valorM3xM:9.39  },
  { faixaLabel:"10000 a 12500 m", mMin:10000,mMax:12500, valorM3xM:10.03 },
  { faixaLabel:"12500 a 15000 m", mMin:12500,mMax:15000, valorM3xM:10.68 },
  { faixaLabel:"15000 a 17500 m", mMin:15000,mMax:17500, valorM3xM:19.06 },
  { faixaLabel:"17500 a 20000 m", mMin:17500,mMax:20000, valorM3xM:21.71 },
];

const _hoje = new Date().toISOString().split("T")[0];
const _ontem = new Date(Date.now()-86400000).toISOString().split("T")[0];

const VIAGENS_SEED = [
  { id:1001, seq:1, caminhaoId:1, placa:"ABC-1234", motorista:"João Silva",     freteiro:"Transportes Silva",  volumeM3:12, destinoId:1, destino:"Fazenda Boa Vista",  distanciaM:2500,  lat:null, lng:null, distStatus:"manual", faixa:"2000 a 3000 m", valorM3xM:6.92, valorTotal:207.60, data:_ontem, hora:"08:15", numero:1, sincronizado:true,  pago:true,  dataPagamento:_ontem, registradoPor:"Apontador" },
  { id:1002, seq:2, caminhaoId:2, placa:"DEF-5678", motorista:"Carlos Pereira", freteiro:"Pereira Fretamento", volumeM3:14, destinoId:2, destino:"Obra Centro",        distanciaM:8000,  lat:null, lng:null, distStatus:"manual", faixa:"7500 a 10000 m",valorM3xM:9.39, valorTotal:1051.68,data:_ontem, hora:"09:30", numero:1, sincronizado:true,  pago:true,  dataPagamento:_ontem, registradoPor:"Apontador" },
  { id:1003, seq:3, caminhaoId:1, placa:"ABC-1234", motorista:"João Silva",     freteiro:"Transportes Silva",  volumeM3:12, destinoId:1, destino:"Fazenda Boa Vista",  distanciaM:2500,  lat:null, lng:null, distStatus:"manual", faixa:"2000 a 3000 m", valorM3xM:6.92, valorTotal:207.60, data:_ontem, hora:"11:00", numero:2, sincronizado:true,  pago:false, dataPagamento:null,   registradoPor:"Apontador" },
  { id:1004, seq:4, caminhaoId:3, placa:"GHI-9012", motorista:"Maria Santos",   freteiro:"Santos & Cia",       volumeM3:10, destinoId:3, destino:"Condomínio Norte",   distanciaM:5000,  lat:null, lng:null, distStatus:"manual", faixa:"3000 a 5000 m", valorM3xM:8.09, valorTotal:404.50, data:_hoje,  hora:"07:45", numero:1, sincronizado:false, pago:false, dataPagamento:null,   registradoPor:"Apontador" },
  { id:1005, seq:5, caminhaoId:2, placa:"DEF-5678", motorista:"Carlos Pereira", freteiro:"Pereira Fretamento", volumeM3:14, destinoId:4, destino:"Sítio São João",     distanciaM:12000, lat:null, lng:null, distStatus:"manual", faixa:"10000 a 12500 m",valorM3xM:10.03,valorTotal:1685.04,data:_hoje,  hora:"09:20", numero:1, sincronizado:false, pago:false, dataPagamento:null,   registradoPor:"Apontador" },
];

let _nextSeq = 6;
const nextSeq = () => _nextSeq++;

// ── HELPERS ──────────────────────────────────────────────────────
const today   = () => new Date().toISOString().split("T")[0];
const nowTime = () => new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});
const fmt     = (v) => v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const fmtDate = (d) => d.split("-").reverse().join("/");

function getFaixa(metros, tabela) {
  const m = metros < 100 ? metros*1000 : metros;
  return tabela.find(f => m >= f.mMin && m <= f.mMax) || tabela[tabela.length-1];
}
function calcularValor(volumeM3, metros, tabela) {
  const km = metros >= 100 ? metros/1000 : metros;
  const f  = getFaixa(metros, tabela);
  return +(volumeM3 * km * f.valorM3xM).toFixed(2);
}
function haversineM(lat1,lng1,lat2,lng2) {
  const R=6371000, dLat=(lat2-lat1)*Math.PI/180, dLng=(lng2-lng1)*Math.PI/180;
  const a=Math.sin(dLat/2)**2+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return Math.round(R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a)));
}
function obterGPS() {
  return new Promise((res,rej)=>{
    if(!navigator.geolocation){rej(new Error("GPS indisponível"));return;}
    navigator.geolocation.getCurrentPosition(
      p=>res({lat:+p.coords.latitude.toFixed(6),lng:+p.coords.longitude.toFixed(6)}),
      e=>rej(e),{enableHighAccuracy:true,timeout:10000}
    );
  });
}
async function calcularDistanciaEstrada(lat,lng,apiKey) {
  const url=`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${JAZIDA.lat},${JAZIDA.lng}&destinations=${lat},${lng}&key=${apiKey}&mode=driving`;
  const data=await(await fetch(url)).json();
  const metros=data.rows?.[0]?.elements?.[0]?.distance?.value;
  if(!metros) throw new Error("Sem resposta");
  return metros;
}
function gerarComprovante(v) {
  const div="━━━━━━━━━━━━━━━━━━━━";
  const km=(v.distanciaM/1000).toFixed(1);
  return [
    "🚛 *COMPROVANTE DE VIAGEM*",div,
    `🏢 *GERA-OBRAS · CascalhoTrack*`,
    `🔖 *Nº ${v.seq}*   📅 ${fmtDate(v.data)} às ${v.hora}`,div,
    `🚛 *Placa:* ${v.placa}`,
    `👤 *Motorista:* ${v.motorista}`,
    `🏭 *Freteiro:* ${v.freteiro}`,div,
    `📍 *Obra/Destino:* ${v.destino}`,
    `📏 *Distância:* ${v.distanciaM}m (${km}km)`,
    `🗂 *Faixa:* ${v.faixa}`,
    `📦 *Volume:* ${v.volumeM3} m³`,
    `💲 *Fórmula:* ${v.volumeM3}m³ × ${km}km × R$${v.valorM3xM}`,div,
    `🔢 *Viagem Nº:* ${v.numero}`,
    `💰 *VALOR TOTAL: ${fmt(v.valorTotal)}*`,
    v.pago?`✅ *FRETE LANÇADO* em ${fmtDate(v.dataPagamento)}`:`⏳ Aguardando lançamento`,div,
    "_Comprovante gerado automaticamente — CascalhoTrack_"
  ].join("\n");
}
function enviarWhatsApp(numero,texto) {
  window.open("https://wa.me/"+numero+"?text="+encodeURIComponent(texto),"_blank");
}

// ── QR CODE (via API pública) ─────────────────────────────────────
function qrUrl(texto) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(texto)}`;
}

// ── MINI COMPONENTES ─────────────────────────────────────────────
function Card({children,style={}}) {
  return <div style={{background:"#1a1e2a",borderRadius:10,padding:"12px 14px",marginBottom:8,border:"1px solid #2a2f3f",...style}}>{children}</div>;
}
function SLabel({children,mt=4}) {
  return <div style={{fontSize:11,color:"#c4600a",fontWeight:700,letterSpacing:1,marginBottom:8,marginTop:mt}}>{children}</div>;
}
function Sel({label,children,...p}) {
  return (
    <div style={{marginBottom:10}}>
      {label&&<label style={{fontSize:11,color:"#c4600a",fontWeight:700,letterSpacing:1,display:"block",marginBottom:4}}>{label}</label>}
      <select {...p} style={{width:"100%",padding:"10px 12px",background:"#1e2230",border:"1px solid #c4600a44",borderRadius:8,color:"#e8e0d0",fontSize:15,fontFamily:"'Barlow Condensed',sans-serif",boxSizing:"border-box"}}>
        {children}
      </select>
    </div>
  );
}
function Inp({label,...p}) {
  return (
    <div style={{marginBottom:8}}>
      {label&&<label style={{fontSize:10,color:"#9090a0",fontWeight:700,display:"block",marginBottom:3}}>{label}</label>}
      <input {...p} style={{width:"100%",padding:"9px 12px",background:"#0f1117",border:"1px solid #2a2f3f",borderRadius:8,color:"#e8e0d0",fontSize:14,fontFamily:"'Barlow Condensed',sans-serif",boxSizing:"border-box",...p.style}}/>
    </div>
  );
}
function Stat({label,value,accent,small}) {
  return (
    <div style={{background:"#1a1e2a",borderRadius:10,padding:"12px 8px",textAlign:"center",border:"1px solid #2a2f3f"}}>
      <div style={{fontSize:10,color:"#c4600a",fontWeight:700,letterSpacing:1}}>{label}</div>
      <div style={{fontSize:small?14:24,fontWeight:800,color:accent||"#e8e0d0",marginTop:2}}>{value}</div>
    </div>
  );
}
function Btn({children,onClick,disabled,color="#c4600a",full,style={}}) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width:full?"100%":undefined,padding:"9px 16px",
      background:disabled?"#333":color,border:"none",borderRadius:8,
      color:"#fff",fontSize:13,fontWeight:700,cursor:disabled?"not-allowed":"pointer",
      fontFamily:"'Barlow Condensed',sans-serif",opacity:disabled?0.6:1,...style
    }}>{children}</button>
  );
}
function StatusBadge({status}) {
  const map={calculada:{label:"✅ Por estrada",color:"#2ecc71"},gps_linha_reta:{label:"📡 GPS pendente",color:"#f0a500"},manual:{label:"✏️ Manual",color:"#9090a0"}};
  const s=map[status]||map.manual;
  return <span style={{fontSize:10,color:s.color,fontWeight:700}}>{s.label}</span>;
}
function SyncBadge({sincronizado}) {
  return sincronizado
    ?<span style={{fontSize:10,color:"#2ecc71"}}>☁️ Sync</span>
    :<span style={{fontSize:10,color:"#f0a500"}}>📴 Pendente</span>;
}
function PagoBadge({pago,dataPagamento}) {
  return pago
    ?<span style={{fontSize:10,color:"#2ecc71",fontWeight:700,background:"#0d2e1a",border:"1px solid #2ecc7144",borderRadius:4,padding:"1px 6px"}}>✅ FRETE LANÇADO{dataPagamento?" · "+fmtDate(dataPagamento):""}</span>
    :<span style={{fontSize:10,color:"#f0a500",fontWeight:700,background:"#1e1a0a",border:"1px solid #f0a50044",borderRadius:4,padding:"1px 6px"}}>⏳ Aguardando lançamento</span>;
}

// ── TELA LOGIN ───────────────────────────────────────────────────
function TelaLogin({onLogin}) {
  const [login,setLogin]=useState(""); const [senha,setSenha]=useState("");
  const [erro,setErro]=useState(""); const [show,setShow]=useState(false);
  const tentar=()=>{
    const u=USUARIOS.find(u=>u.login===login.trim()&&u.senha===senha);
    if(u) onLogin(u); else setErro("Login ou senha incorretos.");
  };
  return (
    <div style={{minHeight:"100vh",background:"#0f1117",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{fontSize:40,marginBottom:8}}>⛏️</div>
      <div style={{fontSize:26,fontWeight:800,letterSpacing:1,marginBottom:2}}>CASCALHO<span style={{color:"#c4600a"}}>TRACK</span></div>
      <div style={{fontSize:11,color:"#7a7a8a",letterSpacing:2,marginBottom:32}}>CONTROLE DE TRANSPORTE · QR CODE</div>
      <div style={{width:"100%",maxWidth:320}}>
        <Inp label="USUÁRIO" value={login} onChange={e=>{setLogin(e.target.value);setErro("");}} placeholder="Digite seu login"/>
        <div style={{position:"relative"}}>
          <Inp label="SENHA" type={show?"text":"password"} value={senha} onChange={e=>{setSenha(e.target.value);setErro("");}} placeholder="Digite sua senha" style={{paddingRight:44}}/>
          <button onClick={()=>setShow(!show)} style={{position:"absolute",right:10,top:22,background:"none",border:"none",color:"#7a7a8a",cursor:"pointer",fontSize:16}}>{show?"🙈":"👁"}</button>
        </div>
        {erro&&<div style={{color:"#e74c3c",fontSize:12,marginBottom:8,fontWeight:600}}>{erro}</div>}
        <Btn full color="linear-gradient(135deg,#c4600a,#8c3e00)" onClick={tentar} style={{marginTop:4,padding:"12px",fontSize:15}}>ENTRAR</Btn>
        <div style={{marginTop:24,background:"#1a1e2a",borderRadius:10,padding:12,border:"1px solid #2a2f3f"}}>
          <div style={{fontSize:10,color:"#7a7a8a",marginBottom:8,fontWeight:700}}>USUÁRIOS DE DEMONSTRAÇÃO</div>
          {USUARIOS.map(u=>(
            <div key={u.id} onClick={()=>{setLogin(u.login);setSenha(u.senha);setErro("");}}
              style={{padding:"6px 8px",borderRadius:6,cursor:"pointer",marginBottom:4,background:"#0f1117",display:"flex",justifyContent:"space-between"}}>
              <span style={{fontSize:12,color:"#e8e0d0"}}>{u.nome}</span>
              <span style={{fontSize:11,color:"#c4600a",fontWeight:700}}>{u.perfil}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── TELA APONTADOR ───────────────────────────────────────────────
function TelaApontador({viagens,setViagens,caminhoes,destinos,tabela,apiKey,usuario}) {
  const [scanMode,   setScanMode]   = useState(false);
  const [camScanned, setCamScanned] = useState(null); // caminhão identificado pelo QR
  const [selDest,    setSelDest]    = useState(null);
  const [scanInput,  setScanInput]  = useState("");   // simulação: digitar placa
  const [gpsStatus,  setGpsStatus]  = useState("idle");
  const [coords,     setCoords]     = useState(null);
  const [registrando,setRegistrando]= useState(false);
  const [resultado,  setResultado]  = useState(null);
  const [calcStatus, setCalcStatus] = useState({});
  const [toast,      setToast]      = useState(null);

  const showToast=(msg,type="success")=>{setToast({msg,type});setTimeout(()=>setToast(null),3500);};
  const vHoje=viagens.filter(v=>v.data===today());
  const naoSync=viagens.filter(v=>!v.sincronizado);
  const pendentes=viagens.filter(v=>v.distStatus==="gps_linha_reta");

  // Simula leitura do QR — em produção seria a câmera lendo o QR do caminhão
  const lerQR = () => {
    const placa = scanInput.trim().toUpperCase();
    const cam = caminhoes.find(c=>c.placa===placa||c.placa.replace("-","")===placa.replace("-",""));
    if(!cam) { showToast("QR Code não reconhecido!","error"); return; }
    setCamScanned(cam);
    setScanMode(false);
    setScanInput("");
    showToast(`✅ Caminhão identificado: ${cam.placa}`);
  };

  const registrar = async () => {
    if(!camScanned) { showToast("Escaneie o QR Code do caminhão!","error"); return; }
    if(!selDest)    { showToast("Selecione o destino!","error"); return; }

    // Anti-duplicata 15 min
    const agora=Date.now();
    const recente=viagens.find(v=>v.caminhaoId===camScanned.id&&v.data===today()&&
      (agora-new Date(`${v.data}T${v.hora}:00`).getTime())<15*60*1000);
    if(recente){showToast(`⚠️ ${camScanned.placa} já registrado há menos de 15 min!`,"error");return;}

    setRegistrando(true); setResultado(null); setGpsStatus("buscando");
    let gps=null;
    try{gps=await obterGPS();setCoords(gps);setGpsStatus("ok");}
    catch{setGpsStatus("erro");}

    setTimeout(()=>{
      const dest=destinos.find(d=>d.id===selDest);
      const mBase=gps?haversineM(JAZIDA.lat,JAZIDA.lng,gps.lat,gps.lng):(dest.distanciaM||10000);
      const f=getFaixa(mBase,tabela);
      const val=calcularValor(camScanned.volumeM3,mBase,tabela);
      const num=viagens.filter(v=>v.caminhaoId===camScanned.id&&v.data===today()).length+1;
      const nova={
        id:Date.now(), seq:nextSeq(), caminhaoId:camScanned.id, placa:camScanned.placa,
        motorista:camScanned.motorista, freteiro:camScanned.freteiro, volumeM3:camScanned.volumeM3,
        destinoId:dest.id, destino:dest.nome, distanciaM:mBase,
        lat:gps?.lat||null, lng:gps?.lng||null,
        distStatus:gps?"gps_linha_reta":"manual",
        faixa:f.faixaLabel, valorM3xM:f.valorM3xM, valorTotal:val,
        data:today(), hora:nowTime(), numero:num,
        sincronizado:false, pago:false, dataPagamento:null,
        registradoPor:usuario.nome,
      };
      setViagens(p=>[...p,nova]);
      setRegistrando(false); setResultado(nova);
      setCamScanned(null); setSelDest(null);
      showToast(`✅ Viagem #${num} — ${nova.placa} registrada!`);
    },1500);
  };

  const recalcular=async(v)=>{
    if(!apiKey){showToast("Configure a chave Google Maps em Config.","error");return;}
    if(!v.lat){showToast("Esta viagem não tem GPS.","error");return;}
    setCalcStatus(p=>({...p,[v.id]:"calculando"}));
    try{
      const metros=await calcularDistanciaEstrada(v.lat,v.lng,apiKey);
      const f=getFaixa(metros,tabela);
      const novoVal=calcularValor(v.volumeM3,metros,tabela);
      setViagens(p=>p.map(x=>x.id===v.id?{...x,distanciaM:metros,faixa:f.faixaLabel,valorM3xM:f.valorM3xM,valorTotal:novoVal,distStatus:"calculada",sincronizado:false}:x));
      setCalcStatus(p=>({...p,[v.id]:"ok"}));
      showToast(`📏 ${(metros/1000).toFixed(1)}km pela estrada`);
    }catch{
      setCalcStatus(p=>({...p,[v.id]:"erro"}));
      showToast("Erro ao calcular. Verifique internet e API Key.","error");
    }
  };

  const simularSync=()=>{
    setViagens(p=>p.map(v=>({...v,sincronizado:true})));
    showToast(`☁️ ${naoSync.length} viagem(s) sincronizadas!`);
  };

  return (
    <div style={{padding:"14px 14px 80px"}}>

      {/* Sync banner */}
      {naoSync.length>0&&(
        <div style={{background:"#1e1a0a",border:"1px solid #f0a50066",borderRadius:10,padding:"10px 14px",marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:12,fontWeight:700,color:"#f0a500"}}>📴 {naoSync.length} viagem(s) não sincronizadas</div>
            <div style={{fontSize:10,color:"#9090a0"}}>Conecte à internet para sincronizar</div>
          </div>
          <Btn onClick={simularSync} color="#f0a500" style={{fontSize:11,padding:"6px 12px"}}>SYNC ☁️</Btn>
        </div>
      )}

      {/* GPS status */}
      <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",borderRadius:8,marginBottom:12,
        background:gpsStatus==="ok"?"#0d2e1a":gpsStatus==="erro"?"#2e0d0d":"#1a1e2a",
        border:"1px solid "+(gpsStatus==="ok"?"#2ecc7155":gpsStatus==="erro"?"#e74c3c55":"#2a2f3f")}}>
        <span style={{fontSize:16}}>{gpsStatus==="ok"?"📡":gpsStatus==="erro"?"⚠️":gpsStatus==="buscando"?"🔄":"📍"}</span>
        <div>
          <div style={{fontSize:11,fontWeight:700,color:gpsStatus==="ok"?"#2ecc71":gpsStatus==="erro"?"#e74c3c":"#9090a0"}}>
            {gpsStatus==="ok"?"GPS CAPTURADO":gpsStatus==="erro"?"GPS INDISPONÍVEL":gpsStatus==="buscando"?"BUSCANDO GPS...":"AGUARDANDO REGISTRO"}
          </div>
          {coords&&<div style={{fontSize:10,color:"#7a7a8a"}}>{coords.lat}, {coords.lng}</div>}
        </div>
      </div>

      {/* PASSO 1 — Escanear QR */}
      <SLabel>PASSO 1 — ESCANEAR QR CODE DO CAMINHÃO</SLabel>
      {!camScanned ? (
        <Card style={{border:"1px solid #c4600a44"}}>
          {!scanMode ? (
            <div style={{textAlign:"center",padding:"8px 0"}}>
              <div style={{fontSize:40,marginBottom:8}}>📷</div>
              <div style={{fontSize:13,color:"#9090a0",marginBottom:12}}>Aponte a câmera para o QR Code colado no caminhão</div>
              <Btn full onClick={()=>setScanMode(true)} color="linear-gradient(135deg,#c4600a,#8c3e00)" style={{fontSize:15,padding:"12px"}}>
                📷 ABRIR CÂMERA / ESCANEAR QR
              </Btn>
            </div>
          ) : (
            <div>
              <div style={{fontSize:12,color:"#c4600a",fontWeight:700,marginBottom:8}}>📷 SIMULAÇÃO DE SCANNER</div>
              <div style={{fontSize:11,color:"#7a7a8a",marginBottom:8}}>
                Em produção a câmera leria o QR automaticamente.<br/>
                Para testar: digite a placa do caminhão abaixo.
              </div>
              <Inp
                placeholder="Digite a placa (ex: ABC-1234)"
                value={scanInput}
                onChange={e=>setScanInput(e.target.value.toUpperCase())}
                style={{fontSize:18,fontWeight:700,textAlign:"center",letterSpacing:2}}
              />
              <div style={{display:"flex",gap:8,marginTop:4}}>
                <Btn full onClick={lerQR} color="#2ecc71">✅ CONFIRMAR</Btn>
                <Btn onClick={()=>{setScanMode(false);setScanInput("");}} color="#555" style={{padding:"9px 16px"}}>✕</Btn>
              </div>
              <div style={{marginTop:12}}>
                <div style={{fontSize:10,color:"#7a7a8a",marginBottom:6}}>ATALHO — CLIQUE PARA SELECIONAR:</div>
                {caminhoes.map(c=>(
                  <div key={c.id} onClick={()=>{setCamScanned(c);setScanMode(false);setScanInput("");showToast(`✅ ${c.placa} identificado`);}}
                    style={{padding:"8px 12px",background:"#0f1117",borderRadius:7,marginBottom:4,cursor:"pointer",display:"flex",gap:8,alignItems:"center",border:"1px solid #2a2f3f"}}>
                    <span style={{fontSize:18}}>🚛</span>
                    <div>
                      <div style={{fontWeight:700}}>{c.placa}</div>
                      <div style={{fontSize:11,color:"#9090a0"}}>{c.motorista} · {c.volumeM3}m³</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      ) : (
        <Card style={{background:"#0d2e1a",border:"1px solid #2ecc7155",marginBottom:10}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{color:"#2ecc71",fontWeight:800,fontSize:13}}>✅ CAMINHÃO IDENTIFICADO</div>
              <div style={{fontWeight:700,fontSize:16,marginTop:2}}>{camScanned.placa}</div>
              <div style={{fontSize:12,color:"#9090a0"}}>{camScanned.motorista} · {camScanned.freteiro} · {camScanned.volumeM3}m³</div>
            </div>
            <button onClick={()=>setCamScanned(null)} style={{background:"#1a1e2a",border:"1px solid #2a2f3f",borderRadius:7,padding:"6px 10px",color:"#9090a0",cursor:"pointer",fontSize:12,fontFamily:"'Barlow Condensed',sans-serif"}}>TROCAR</button>
          </div>
        </Card>
      )}

      {/* PASSO 2 — Destino */}
      <SLabel mt={16}>PASSO 2 — LOCAL DE DESCARGA</SLabel>
      <Sel value={selDest||""} onChange={e=>setSelDest(Number(e.target.value))}>
        <option value="">— Selecione o destino —</option>
        {destinos.map(d=><option key={d.id} value={d.id}>{d.nome} · {(d.distanciaM/1000).toFixed(1)}km</option>)}
      </Sel>

      {/* Preview valor */}
      {camScanned&&selDest&&(()=>{
        const dest=destinos.find(d=>d.id===selDest);
        const f=getFaixa(dest.distanciaM,tabela);
        const val=calcularValor(camScanned.volumeM3,dest.distanciaM,tabela);
        return (
          <div style={{background:"#0d1e10",border:"1px solid #2ecc7144",borderRadius:10,padding:"10px 14px",marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{fontSize:12}}>
              <div style={{color:"#9090a0"}}>{camScanned.volumeM3}m³ × {(dest.distanciaM/1000).toFixed(1)}km × R${f.valorM3xM}</div>
              <div style={{color:"#7a7a8a"}}>Faixa: {f.faixaLabel}</div>
            </div>
            <div style={{fontSize:22,fontWeight:800,color:"#2ecc71"}}>{fmt(val)}</div>
          </div>
        );
      })()}

      {/* PASSO 3 — Registrar */}
      <SLabel mt={4}>PASSO 3 — CONFIRMAR REGISTRO</SLabel>
      <Btn full onClick={registrar} disabled={registrando||!camScanned||!selDest}
        color="linear-gradient(135deg,#c4600a,#8c3e00)"
        style={{padding:"14px",fontSize:16,marginBottom:14,opacity:(camScanned&&selDest)?1:0.4}}>
        {registrando?"⏳ REGISTRANDO...":"✅ REGISTRAR VIAGEM"}
      </Btn>

      {/* Comprovante */}
      {resultado&&(
        <Card style={{background:"#0a1f12",border:"1px solid #2ecc7155",marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <div style={{color:"#2ecc71",fontWeight:800,fontSize:13}}>✅ COMPROVANTE</div>
            <div style={{background:"#c4600a",color:"#fff",fontWeight:800,fontSize:12,borderRadius:5,padding:"2px 8px"}}>Nº {resultado.seq}</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"auto 1fr",gap:"4px 12px",fontSize:13}}>
            {[
              ["Placa",resultado.placa],["Motorista",resultado.motorista],
              ["Destino",resultado.destino],["Distância",`${resultado.distanciaM}m (${(resultado.distanciaM/1000).toFixed(1)}km)`],
              ["Faixa",resultado.faixa],["Volume",`${resultado.volumeM3}m³`],
              ["R$/m³×km",`R$ ${resultado.valorM3xM}`],["Viagem Nº",`#${resultado.numero}`],["Horário",resultado.hora],
            ].map(([k,v])=>[
              <span key={k} style={{color:"#7a7a8a"}}>{k}:</span>,
              <span key={k+"v"} style={{fontWeight:600}}>{v}</span>
            ])}
            <span style={{color:"#7a7a8a"}}>VALOR:</span>
            <span style={{color:"#2ecc71",fontWeight:800,fontSize:16}}>{fmt(resultado.valorTotal)}</span>
          </div>
          {(()=>{
            const cam=caminhoes.find(c=>c.id===resultado.caminhaoId);
            return cam?.whatsapp?(
              <button onClick={()=>enviarWhatsApp(cam.whatsapp,gerarComprovante(resultado))}
                style={{width:"100%",marginTop:10,padding:"10px",borderRadius:8,border:"none",
                  background:"linear-gradient(135deg,#25D366,#128C7E)",
                  color:"#fff",fontWeight:800,fontSize:13,cursor:"pointer",
                  fontFamily:"'Barlow Condensed',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                <span style={{fontSize:16}}>📤</span> ENVIAR COMPROVANTE NO WHATSAPP
              </button>
            ):null;
          })()}
        </Card>
      )}

      {/* Pendentes GPS */}
      {pendentes.length>0&&(
        <>
          <SLabel mt={16}>📡 CALCULAR DISTÂNCIA POR ESTRADA ({pendentes.length})</SLabel>
          {pendentes.map(v=>(
            <Card key={v.id} style={{borderLeft:"3px solid #f0a500"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontWeight:700,fontSize:13}}>{v.placa} — #{v.numero}</div>
                  <div style={{fontSize:11,color:"#9090a0"}}>{fmtDate(v.data)} · {(v.distanciaM/1000).toFixed(1)}km estimado</div>
                  <div style={{fontSize:10,color:"#7a7a8a"}}>📍 {v.lat}, {v.lng}</div>
                </div>
                <Btn onClick={()=>recalcular(v)} disabled={calcStatus[v.id]==="calculando"}
                  color={calcStatus[v.id]==="ok"?"#27ae60":"#f0a500"}
                  style={{fontSize:11,padding:"6px 10px",minWidth:80}}>
                  {calcStatus[v.id]==="calculando"?"...":calcStatus[v.id]==="ok"?"✅":"CALCULAR"}
                </Btn>
              </div>
            </Card>
          ))}
        </>
      )}

      {/* Viagens de hoje */}
      <SLabel mt={16}>VIAGENS DE HOJE ({vHoje.length})</SLabel>
      {vHoje.length===0
        ?<div style={{textAlign:"center",color:"#555",padding:20,fontSize:13}}>Nenhuma viagem hoje</div>
        :[...vHoje].reverse().map(v=>(
          <div key={v.id} style={{background:"#1a1e2a",borderRadius:8,padding:"10px 12px",marginBottom:6,borderLeft:"3px solid #c4600a"}}>
            <div style={{display:"flex",justifyContent:"space-between"}}>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:14}}>{v.placa} <span style={{color:"#7a7a8a",fontWeight:400,fontSize:12}}>#{v.numero} · {v.hora}</span></div>
                <div style={{fontSize:12,color:"#9090a0"}}>{v.destino} · {(v.distanciaM/1000).toFixed(1)}km · {v.volumeM3}m³</div>
                <div style={{display:"flex",gap:6,marginTop:2,flexWrap:"wrap"}}>
                  <StatusBadge status={v.distStatus}/><SyncBadge sincronizado={v.sincronizado}/>
                </div>
                <div style={{marginTop:3}}><PagoBadge pago={v.pago} dataPagamento={v.dataPagamento}/></div>
              </div>
              <div style={{fontWeight:800,color:"#2ecc71",fontSize:14}}>{fmt(v.valorTotal)}</div>
            </div>
          </div>
        ))
      }
      {toast&&<div style={{position:"fixed",bottom:20,left:"50%",transform:"translateX(-50%)",background:toast.type==="error"?"#c0392b":"#27ae60",color:"#fff",padding:"10px 20px",borderRadius:10,fontSize:13,fontWeight:700,boxShadow:"0 4px 20px rgba(0,0,0,0.4)",zIndex:999,whiteSpace:"nowrap",fontFamily:"'Barlow Condensed',sans-serif"}}>{toast.msg}</div>}
    </div>
  );
}

// ── TELA MOTORISTA ───────────────────────────────────────────────
function TelaMotorista({viagens,caminhoes,setCaminhoes,usuario,onSair}) {
  const [subTab,setSubTab]=useState("hoje");
  const [editando,setEditando]=useState(false);
  const [eMot,setEMot]=useState(""); const [ePlaca,setEPlaca]=useState("");
  const [eFret,setEFret]=useState(""); const [eVol,setEVol]=useState("");
  const [eWa,setEWa]=useState(""); const [eCpf,setECpf]=useState("");
  const [eTel,setETel]=useState("");
  const [toast,setToast]=useState(null);
  const showToast=(msg,type="success")=>{setToast({msg,type});setTimeout(()=>setToast(null),3000);};

  const cam=caminhoes.find(c=>c.id===usuario.caminhaoId);
  if(!cam) return (
    <div style={{padding:32,textAlign:"center"}}>
      <div style={{fontSize:40,marginBottom:12}}>🚛</div>
      <div style={{fontSize:15,color:"#9090a0",marginBottom:8}}>Nenhum caminhão vinculado a este usuário.</div>
      <div style={{fontSize:12,color:"#555",marginBottom:24}}>Aguarde o gestor cadastrar seu caminhão.</div>
      <button onClick={onSair} style={{background:"#c4600a",border:"none",borderRadius:10,padding:"12px 28px",color:"#fff",fontSize:15,fontWeight:800,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif"}}>← VOLTAR AO LOGIN</button>
    </div>
  );

  const vHoje=viagens.filter(v=>v.caminhaoId===cam.id&&v.data===today());
  const vMes =viagens.filter(v=>v.caminhaoId===cam.id&&v.data.startsWith(new Date().toISOString().slice(0,7)));

  const abrirEdit=()=>{setEMot(cam.motorista);setEPlaca(cam.placa);setEFret(cam.freteiro||"");setEVol(String(cam.volumeM3));setEWa(cam.whatsapp||"");setECpf(cam.cpfCnpj||"");setETel(cam.telefone||"");setEditando(true);};
  const salvarPerfil=()=>{
    if(!ePlaca.trim()||!eMot.trim()){showToast("Placa e nome são obrigatórios!","error");return;}
    setCaminhoes(p=>p.map(c=>c.id===cam.id?{...c,placa:ePlaca.toUpperCase().trim(),motorista:eMot.trim(),freteiro:eFret.trim(),volumeM3:parseFloat(eVol)||c.volumeM3,whatsapp:eWa.replace(/\D/g,""),cpfCnpj:eCpf.trim(),telefone:eTel.replace(/\D/g,"")}:c));
    setEditando(false);showToast("✅ Dados atualizados!");
  };

  const TABS=[{key:"hoje",label:"🗓 Hoje"},{key:"mes",label:"📅 Mês"},{key:"qrcode",label:"🔲 QR Code"},{key:"perfil",label:"👤 Meu Perfil"}];

  return (
    <div style={{padding:"14px 14px 80px"}}>
      {toast&&<div style={{position:"fixed",top:16,left:"50%",transform:"translateX(-50%)",zIndex:999,background:toast.type==="error"?"#c0392b":"#27ae60",color:"#fff",padding:"10px 22px",borderRadius:10,fontWeight:700,fontSize:14,boxShadow:"0 4px 16px #0008"}}>{toast.msg}</div>}

      {/* Card resumo */}
      <Card style={{borderLeft:"3px solid #c4600a",marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <div style={{fontWeight:800,fontSize:16}}>{cam.placa}</div>
            <div style={{fontSize:12,color:"#9090a0"}}>{cam.motorista} · {cam.freteiro}</div>
            <div style={{fontSize:11,color:"#c4600a"}}>Caçamba: {cam.volumeM3}m³</div>
            {cam.cpfCnpj&&<div style={{fontSize:11,color:"#9090a0",marginTop:2}}>CPF/CNPJ: {cam.cpfCnpj}</div>}
            {cam.telefone&&<div style={{fontSize:11,color:"#9090a0"}}>Tel: {cam.telefone}</div>}
          </div>
          <button onClick={()=>setSubTab("perfil")} style={{background:"#1e2230",border:"1px solid #2a2f3f",borderRadius:8,padding:"6px 12px",color:"#c4600a",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif"}}>✏️ EDITAR</button>
        </div>
      </Card>

      {/* Tabs */}
      <div style={{display:"flex",gap:4,marginBottom:12,overflowX:"auto"}}>
        {TABS.map(t=>(
          <button key={t.key} onClick={()=>setSubTab(t.key)} style={{
            flex:1,padding:"8px 4px",background:subTab===t.key?"#c4600a":"#1a1e2a",
            border:"1px solid "+(subTab===t.key?"#c4600a":"#2a2f3f"),whiteSpace:"nowrap",
            borderRadius:8,color:"#e8e0d0",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif"
          }}>{t.label}</button>
        ))}
      </div>

      {/* HOJE */}
      {subTab==="hoje"&&(
        <>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
            <Stat label="VIAGENS" value={vHoje.length}/>
            <Stat label="VOLUME"  value={`${vHoje.reduce((s,v)=>s+v.volumeM3,0)}m³`} small/>
            <Stat label="RECEBER HOJE" value={fmt(vHoje.reduce((s,v)=>s+v.valorTotal,0))} accent="#2ecc71" small/>
            <Stat label="TOTAL MÊS"    value={fmt(vMes.reduce((s,v)=>s+v.valorTotal,0))}  accent="#5b9cf6" small/>
          </div>
          <SLabel>MINHAS VIAGENS HOJE</SLabel>
          {vHoje.length===0
            ?<div style={{textAlign:"center",color:"#555",padding:20,fontSize:13}}>Nenhuma viagem hoje</div>
            :vHoje.map(v=>(
              <Card key={v.id} style={{borderLeft:"3px solid #2ecc71"}}>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <div>
                    <div style={{display:"flex",gap:6,alignItems:"center"}}>
                      <div style={{fontWeight:700}}>Viagem #{v.numero} · {v.hora}</div>
                      <div style={{background:"#1e2230",color:"#c4600a",fontSize:10,fontWeight:800,borderRadius:4,padding:"1px 7px"}}>Nº{v.seq}</div>
                    </div>
                    <div style={{fontSize:12,color:"#9090a0"}}>{v.destino} · {(v.distanciaM/1000).toFixed(1)}km · {v.volumeM3}m³</div>
                    <div style={{marginTop:3}}><PagoBadge pago={v.pago} dataPagamento={v.dataPagamento}/></div>
                  </div>
                  <div style={{color:"#2ecc71",fontWeight:800,fontSize:15}}>{fmt(v.valorTotal)}</div>
                </div>
              </Card>
            ))
          }
        </>
      )}

      {/* MÊS */}
      {subTab==="mes"&&(()=>{
        const byDate={};
        vMes.forEach(v=>{if(!byDate[v.data])byDate[v.data]=[];byDate[v.data].push(v);});
        return (
          <>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
              <Stat label="VIAGENS MÊS"  value={vMes.length}/>
              <Stat label="TOTAL MÊS"    value={fmt(vMes.reduce((s,v)=>s+v.valorTotal,0))} accent="#2ecc71" small/>
            </div>
            {Object.entries(byDate).sort((a,b)=>b[0].localeCompare(a[0])).map(([data,vs])=>(
              <Card key={data}>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <div>
                    <div style={{fontWeight:700}}>{fmtDate(data)}</div>
                    <div style={{fontSize:12,color:"#9090a0"}}>{vs.length} viagens · {vs.reduce((s,v)=>s+v.volumeM3,0)}m³</div>
                  </div>
                  <div style={{color:"#2ecc71",fontWeight:800}}>{fmt(vs.reduce((s,v)=>s+v.valorTotal,0))}</div>
                </div>
              </Card>
            ))}
          </>
        );
      })()}

      {/* QR CODE */}
      {subTab==="qrcode"&&(
        <div>
          <Card style={{textAlign:"center"}}>
            <div style={{fontSize:12,color:"#9090a0",marginBottom:10}}>Mostre este QR ao apontador para registrar a viagem instantaneamente</div>
            <img src={qrUrl(`CASCALHOTRACK:${cam.placa}:${cam.id}`)} alt={`QR ${cam.placa}`}
              style={{width:200,height:200,borderRadius:8,border:"4px solid #c4600a"}}/>
            <div style={{fontWeight:800,fontSize:22,letterSpacing:4,marginTop:10,color:"#c4600a"}}>{cam.placa}</div>
            <div style={{fontSize:12,color:"#9090a0",marginTop:4}}>{cam.motorista}</div>
            <button onClick={()=>window.open(qrUrl(`CASCALHOTRACK:${cam.placa}:${cam.id}`),"_blank")}
              style={{width:"100%",marginTop:14,padding:"10px",background:"#1e2230",border:"1px solid #c4600a44",borderRadius:8,color:"#c4600a",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif"}}>
              🖨️ ABRIR PARA IMPRIMIR
            </button>
          </Card>
        </div>
      )}

      {/* MEU PERFIL */}
      {subTab==="perfil"&&(
        <div>
          <SLabel>MEUS DADOS</SLabel>
          {!editando?(
            <div>
              <Card>
                <div style={{display:"grid",gap:10}}>
                  {[
                    {label:"PLACA",       val:cam.placa},
                    {label:"NOME",        val:cam.motorista},
                    {label:"EMPRESA/FRETEIRO", val:cam.freteiro||"—"},
                    {label:"CAÇAMBA",     val:cam.volumeM3+"m³"},
                    {label:"WHATSAPP",    val:cam.whatsapp||"—"},
                    {label:"TELEFONE",    val:cam.telefone||"—"},
                    {label:"CPF / CNPJ",  val:cam.cpfCnpj||"—"},
                  ].map(({label,val})=>(
                    <div key={label} style={{borderBottom:"1px solid #1e2230",paddingBottom:8}}>
                      <div style={{fontSize:10,color:"#7a7a8a",fontWeight:700,marginBottom:2}}>{label}</div>
                      <div style={{fontSize:14,fontWeight:600,color:val==="—"?"#555":"#e8e0d0"}}>{val}</div>
                    </div>
                  ))}
                </div>
              </Card>
              <Btn full onClick={abrirEdit} style={{marginTop:12}}>✏️ EDITAR MEUS DADOS</Btn>
            </div>
          ):(
            <Card style={{border:"1px solid #c4600a44"}}>
              <div style={{fontSize:12,fontWeight:700,color:"#c4600a",marginBottom:12}}>✏️ EDITANDO MEUS DADOS</div>
              <Inp label="PLACA DO CAMINHÃO" value={ePlaca} onChange={e=>setEPlaca(e.target.value)} placeholder="Ex: ABC-1234"/>
              <Inp label="SEU NOME" value={eMot} onChange={e=>setEMot(e.target.value)} placeholder="Nome completo"/>
              <Inp label="EMPRESA / FRETEIRO" value={eFret} onChange={e=>setEFret(e.target.value)} placeholder="Nome da empresa"/>
              <Inp label="VOLUME DA CAÇAMBA (m³)" type="number" value={eVol} onChange={e=>setEVol(e.target.value)} placeholder="Ex: 12"/>
              <Inp label="WHATSAPP (com DDD)" value={eWa} onChange={e=>setEWa(e.target.value)} placeholder="Ex: 65999990001"/>
              <Inp label="TELEFONE (com DDD)" value={eTel} onChange={e=>setETel(e.target.value)} placeholder="Ex: 65999990001"/>
              <Inp label="CPF ou CNPJ" value={eCpf} onChange={e=>setECpf(e.target.value)} placeholder="Somente números"/>
              <div style={{display:"flex",gap:8,marginTop:4}}>
                <Btn full onClick={salvarPerfil} color="#2ecc71">SALVAR ✅</Btn>
                <Btn onClick={()=>setEditando(false)} color="#555" style={{padding:"9px 16px"}}>CANCELAR</Btn>
              </div>
            </Card>
          )}

          <div style={{marginTop:20}}>
            <SLabel>MEU QR CODE</SLabel>
            <Card style={{textAlign:"center"}}>
              <img src={qrUrl(`CASCALHOTRACK:${cam.placa}:${cam.id}`)} alt={`QR ${cam.placa}`}
                style={{width:140,height:140,borderRadius:8,border:"3px solid #c4600a"}}/>
              <div style={{fontWeight:800,fontSize:16,color:"#c4600a",marginTop:6,letterSpacing:3}}>{cam.placa}</div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

// ── TELA GESTOR ──────────────────────────────────────────────────
function TelaGestor({viagens,setViagens,caminhoes,setCaminhoes,destinos,setDestinos,tabela,setTabela,apiKey,setApiKey}) {
  const [subTab,setSubTab]=useState("dashboard");
  const [relData,setRelData]=useState(today());
  const [relPer,setRelPer]=useState("semana");
  const [relDest,setRelDest]=useState("todos");
  const [showAddCam,setShowAddCam]=useState(false);
  const [showAddDest,setShowAddDest]=useState(false);
  const [showQR,setShowQR]=useState(null);
  const [nPlaca,setNPlaca]=useState(""); const [nMot,setNMot]=useState("");
  const [nFret,setNFret]=useState("");   const [nVol,setNVol]=useState("");
  const [nWa,setNWa]=useState("");
  const [nDNome,setNDNome]=useState(""); const [nDKm,setNDKm]=useState("");
  const [editDestId,setEditDestId]=useState(null);
  const [editDestNome,setEditDestNome]=useState("");
  const [editDestKm,setEditDestKm]=useState("");
  const [editCamId,setEditCamId]=useState(null);
  const [editCamPlaca,setEditCamPlaca]=useState("");
  const [editCamMot,setEditCamMot]=useState("");
  const [editCamFret,setEditCamFret]=useState("");
  const [editCamVol,setEditCamVol]=useState("");
  const [editCamWa,setEditCamWa]=useState("");
  const [toast,setToast]=useState(null);
  const showToast=(msg,type="success")=>{setToast({msg,type});setTimeout(()=>setToast(null),3000);};

  const grpCam =(l)=>{const m={};l.forEach(v=>{if(!m[v.placa])m[v.placa]={placa:v.placa,motorista:v.motorista,freteiro:v.freteiro,n:0,vol:0,val:0};m[v.placa].n++;m[v.placa].vol+=v.volumeM3;m[v.placa].val+=v.valorTotal;});return Object.values(m).sort((a,b)=>b.n-a.n);};
  const grpDest=(l)=>{const m={};l.forEach(v=>{if(!m[v.destino])m[v.destino]={dest:v.destino,km:v.distanciaM/1000,n:0,vol:0,val:0};m[v.destino].n++;m[v.destino].vol+=v.volumeM3;m[v.destino].val+=v.valorTotal;});return Object.values(m).sort((a,b)=>b.n-a.n);};
  const getPer=()=>{const now=new Date();return viagens.filter(v=>{const d=new Date(v.data+"T00:00:00");return relPer==="semana"?(now-d)/86400000<=7:d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear();});};

  const marcarPago=(id)=>{setViagens(p=>p.map(v=>v.id===id?{...v,pago:true,dataPagamento:today(),sincronizado:false}:v));showToast("✅ Frete lançado!");};
  const desmarcarPago=(id)=>{setViagens(p=>p.map(v=>v.id===id?{...v,pago:false,dataPagamento:null,sincronizado:false}:v));showToast("↩️ Revertido");};
  const addCam=()=>{if(!nPlaca||!nMot||!nFret||!nVol){showToast("Preencha todos os campos!","error");return;}setCaminhoes(p=>[...p,{id:Date.now(),placa:nPlaca.toUpperCase(),motorista:nMot,freteiro:nFret,volumeM3:parseFloat(nVol),whatsapp:nWa.replace(/\D/g,"")}]);setNPlaca("");setNMot("");setNFret("");setNVol("");setNWa("");setShowAddCam(false);showToast("Caminhão cadastrado!");};
  const addDest=()=>{if(!nDNome||!nDKm){showToast("Preencha todos os campos!","error");return;}const m=parseInt(nDKm)||0;setDestinos(p=>[...p,{id:Date.now(),nome:nDNome,distanciaM:m}]);setNDNome("");setNDKm("");setShowAddDest(false);showToast("Destino cadastrado!");};
  const abrirEditDest=(d)=>{setEditDestId(d.id);setEditDestNome(d.nome);setEditDestKm(String(d.distanciaM));};
  const salvarDest=()=>{if(!editDestNome||!editDestKm){showToast("Preencha todos os campos!","error");return;}setDestinos(p=>p.map(d=>d.id===editDestId?{...d,nome:editDestNome,distanciaM:parseInt(editDestKm)||0}:d));setEditDestId(null);showToast("Destino atualizado!");};
  const excluirDest=(id)=>{if(!window.confirm("Excluir este destino?"))return;setDestinos(p=>p.filter(d=>d.id!==id));showToast("Destino excluído.");};
  const abrirEditCam=(c)=>{setEditCamId(c.id);setEditCamPlaca(c.placa);setEditCamMot(c.motorista);setEditCamFret(c.freteiro);setEditCamVol(String(c.volumeM3));setEditCamWa(c.whatsapp||"");};
  const salvarCam=()=>{if(!editCamPlaca||!editCamMot||!editCamFret||!editCamVol){showToast("Preencha todos os campos!","error");return;}setCaminhoes(p=>p.map(c=>c.id===editCamId?{...c,placa:editCamPlaca.toUpperCase(),motorista:editCamMot,freteiro:editCamFret,volumeM3:parseFloat(editCamVol),whatsapp:editCamWa.replace(/\D/g,"")}:c));setEditCamId(null);showToast("Caminhão atualizado!");};
  const excluirCam=(id)=>{if(!window.confirm("Excluir este caminhão?"))return;setCaminhoes(p=>p.filter(c=>c.id!==id));showToast("Caminhão excluído.");};

  const vHoje=viagens.filter(v=>v.data===today());
  const naoSync=viagens.filter(v=>!v.sincronizado);
  const naoPago=viagens.filter(v=>!v.pago);

  const SUB=[{key:"dashboard",label:"📊 Dashboard"},{key:"pagamentos",label:"💰 Pagamentos"},{key:"relatorios",label:"📋 Relatórios"},{key:"qrcodes",label:"🔲 QR Codes"},{key:"config",label:"⚙️ Config"}];

  return (
    <div>
      <div style={{display:"flex",background:"#131720",borderBottom:"1px solid #2a2f3f",overflowX:"auto"}}>
        {SUB.map(s=>(
          <button key={s.key} onClick={()=>setSubTab(s.key)} style={{
            flex:"0 0 auto",padding:"8px 10px",background:"none",border:"none",
            color:subTab===s.key?"#c4600a":"#7a7a8a",fontSize:10,fontWeight:700,
            cursor:"pointer",borderBotton:subTab===s.key?"2px solid #c4600a":"2px solid transparent",
            fontFamily:"'Barlow Condensed',sans-serif",whiteSpace:"nowrap"
          }}>{s.label}</button>
        ))}
      </div>

      <div style={{padding:"14px 14px 80px"}}>

        {/* DASHBOARD */}
        {subTab==="dashboard"&&(
          <div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
              <Stat label="VIAGENS HOJE" value={vHoje.length}/>
              <Stat label="VOLUME"       value={`${vHoje.reduce((s,v)=>s+v.volumeM3,0)}m³`} small/>
              <Stat label="TOTAL"        value={fmt(vHoje.reduce((s,v)=>s+v.valorTotal,0))} accent="#2ecc71" small/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
              <Card style={{textAlign:"center"}}>
                <div style={{fontSize:10,color:naoSync.length>0?"#f0a500":"#2ecc71",fontWeight:700}}>📴 NÃO SYNC</div>
                <div style={{fontSize:24,fontWeight:800,color:naoSync.length>0?"#f0a500":"#2ecc71"}}>{naoSync.length}</div>
              </Card>
              <Card style={{textAlign:"center"}}>
                <div style={{fontSize:10,color:naoPago.length>0?"#f0a500":"#2ecc71",fontWeight:700}}>⏳ A LANÇAR</div>
                <div style={{fontSize:24,fontWeight:800,color:naoPago.length>0?"#f0a500":"#2ecc71"}}>{naoPago.length}</div>
              </Card>
            </div>
            {naoPago.length>0&&(
              <div style={{background:"#1e1a0a",border:"1px solid #f0a50066",borderRadius:10,padding:"10px 14px",marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontSize:12,fontWeight:700,color:"#f0a500"}}>💰 {naoPago.length} fretes aguardando lançamento</div>
                  <div style={{fontSize:11,color:"#9090a0"}}>{fmt(naoPago.reduce((s,v)=>s+v.valorTotal,0))} a lançar</div>
                </div>
                <Btn onClick={()=>setSubTab("pagamentos")} color="#f0a500" style={{fontSize:11,padding:"6px 12px"}}>VER</Btn>
              </div>
            )}
            <SLabel>POR CAMINHÃO — HOJE</SLabel>
            {grpCam(vHoje).length===0
              ?<div style={{textAlign:"center",color:"#555",padding:20}}>Sem viagens hoje</div>
              :grpCam(vHoje).map((g,i)=>(
                <Card key={i} style={{borderLeft:"3px solid #c4600a"}}>
                  <div style={{display:"flex",justifyContent:"space-between"}}>
                    <div>
                      <div style={{fontWeight:700}}>{g.placa}</div>
                      <div style={{fontSize:12,color:"#9090a0"}}>{g.freteiro} · {g.n} viagens · {g.vol}m³</div>
                    </div>
                    <div style={{color:"#2ecc71",fontWeight:800,fontSize:14}}>{fmt(g.val)}</div>
                  </div>
                </Card>
              ))
            }
            <SLabel mt={16}>ÚLTIMAS VIAGENS</SLabel>
            {[...viagens].reverse().slice(0,5).map(v=>(
              <div key={v.id} style={{background:"#1a1e2a",borderRadius:8,padding:"10px 12px",marginBottom:6,borderLeft:"3px solid #2a2f3f"}}>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <div>
                    <div style={{fontWeight:700,fontSize:13}}>{v.placa} <span style={{color:"#7a7a8a",fontWeight:400}}>Nº{v.seq}</span></div>
                    <div style={{fontSize:11,color:"#9090a0"}}>{fmtDate(v.data)} {v.hora} · {v.destino}</div>
                    <div style={{display:"flex",gap:6,marginTop:2}}><StatusBadge status={v.distStatus}/><SyncBadge sincronizado={v.sincronizado}/></div>
                    <div style={{marginTop:2}}><PagoBadge pago={v.pago} dataPagamento={v.dataPagamento}/></div>
                  </div>
                  <div style={{color:"#2ecc71",fontWeight:800}}>{fmt(v.valorTotal)}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PAGAMENTOS */}
        {subTab==="pagamentos"&&(()=>{
          const pagas=viagens.filter(v=>v.pago);
          return (
            <div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
                <div style={{background:"#1e1a0a",borderRadius:10,padding:"12px 8px",textAlign:"center",border:"1px solid #f0a50044"}}>
                  <div style={{fontSize:10,color:"#f0a500",fontWeight:700}}>⏳ A LANÇAR</div>
                  <div style={{fontSize:20,fontWeight:800,color:"#f0a500",marginTop:2}}>{naoPago.length}</div>
                  <div style={{fontSize:11,color:"#f0a500"}}>{fmt(naoPago.reduce((s,v)=>s+v.valorTotal,0))}</div>
                </div>
                <div style={{background:"#0d2e1a",borderRadius:10,padding:"12px 8px",textAlign:"center",border:"1px solid #2ecc7144"}}>
                  <div style={{fontSize:10,color:"#2ecc71",fontWeight:700}}>✅ LANÇADOS</div>
                  <div style={{fontSize:20,fontWeight:800,color:"#2ecc71",marginTop:2}}>{pagas.length}</div>
                  <div style={{fontSize:11,color:"#2ecc71"}}>{fmt(pagas.reduce((s,v)=>s+v.valorTotal,0))}</div>
                </div>
              </div>
              <SLabel>⏳ AGUARDANDO LANÇAMENTO</SLabel>
              {naoPago.length===0
                ?<div style={{textAlign:"center",color:"#555",padding:20,fontSize:13}}>Nenhuma pendente</div>
                :[...naoPago].reverse().map(v=>(
                  <Card key={v.id} style={{borderLeft:"3px solid #f0a500"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",gap:6,alignItems:"center"}}>
                          <div style={{background:"#c4600a",color:"#fff",fontSize:10,fontWeight:800,borderRadius:4,padding:"1px 7px"}}>Nº{v.seq}</div>
                          <div style={{fontWeight:700,fontSize:13}}>{v.placa}</div>
                        </div>
                        <div style={{fontSize:12,color:"#9090a0",marginTop:2}}>{fmtDate(v.data)} · {v.hora} · {v.destino}</div>
                        <div style={{fontSize:11,color:"#7a7a8a"}}>{v.volumeM3}m³ · {(v.distanciaM/1000).toFixed(1)}km · {v.freteiro}</div>
                      </div>
                      <div style={{textAlign:"right",marginLeft:8}}>
                        <div style={{color:"#2ecc71",fontWeight:800,fontSize:14,marginBottom:4}}>{fmt(v.valorTotal)}</div>
                        <button onClick={()=>marcarPago(v.id)} style={{background:"#2ecc71",border:"none",borderRadius:6,padding:"5px 10px",color:"#fff",fontSize:11,fontWeight:800,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif"}}>LANÇAR ✅</button>
                      </div>
                    </div>
                  </Card>
                ))
              }
              <SLabel mt={16}>✅ FRETES LANÇADOS</SLabel>
              {[...pagas].reverse().map(v=>(
                <Card key={v.id} style={{borderLeft:"3px solid #2ecc71",opacity:0.85}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div>
                      <div style={{display:"flex",gap:6,alignItems:"center"}}>
                        <div style={{background:"#1e2230",color:"#9090a0",fontSize:10,fontWeight:800,borderRadius:4,padding:"1px 7px"}}>Nº{v.seq}</div>
                        <div style={{fontWeight:700,fontSize:13}}>{v.placa}</div>
                      </div>
                      <div style={{fontSize:11,color:"#9090a0"}}>{fmtDate(v.data)} · {v.freteiro}</div>
                      <div style={{fontSize:10,color:"#2ecc71"}}>Lançado em {fmtDate(v.dataPagamento)}</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{color:"#2ecc71",fontWeight:800}}>{fmt(v.valorTotal)}</div>
                      <button onClick={()=>desmarcarPago(v.id)} style={{background:"none",border:"1px solid #555",borderRadius:6,padding:"3px 8px",color:"#9090a0",fontSize:10,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",marginTop:4}}>↩️ Reverter</button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          );
        })()}

        {/* RELATÓRIOS */}
        {subTab==="relatorios"&&(
          <div>
            <div style={{display:"flex",gap:6,marginBottom:14}}>
              {[{key:"rel_dia",label:"Por Dia"},{key:"rel_periodo",label:"Período"},{key:"rel_destino",label:"Por Destino"}].map(r=>(
                <button key={r.key} onClick={()=>setSubTab(r.key)} style={{flex:1,padding:"8px 4px",background:subTab===r.key?"#c4600a":"#1a1e2a",border:"1px solid "+(subTab===r.key?"#c4600a":"#2a2f3f"),borderRadius:8,color:"#e8e0d0",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif"}}>{r.label}</button>
              ))}
            </div>
            <div style={{textAlign:"center",color:"#555",padding:20,fontSize:13}}>👆 Selecione um tipo acima</div>
          </div>
        )}
        {subTab==="rel_dia"&&(()=>{
          const lista=viagens.filter(v=>v.data===relData);
          const tVol=lista.reduce((s,v)=>s+v.volumeM3,0),tVal=lista.reduce((s,v)=>s+v.valorTotal,0);
          return (<div>
            <input type="date" value={relData} onChange={e=>setRelData(e.target.value)} style={{width:"100%",padding:"10px 12px",background:"#1e2230",border:"1px solid #c4600a44",borderRadius:8,color:"#e8e0d0",fontSize:15,marginBottom:12,fontFamily:"'Barlow Condensed',sans-serif",boxSizing:"border-box"}}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}><Stat label="VIAGENS" value={lista.length}/><Stat label="VOLUME" value={`${tVol}m³`} small/><Stat label="TOTAL" value={fmt(tVal)} accent="#2ecc71" small/></div>
            <SLabel>POR CAMINHÃO</SLabel>
            {grpCam(lista).length===0?<div style={{textAlign:"center",color:"#555",padding:20}}>Sem viagens</div>:grpCam(lista).map((g,i)=>(
              <Card key={i} style={{borderLeft:"3px solid #c4600a"}}>
                <div style={{display:"flex",justifyContent:"space-between"}}><div><div style={{fontWeight:700}}>{g.placa}</div><div style={{fontSize:12,color:"#9090a0"}}>{g.motorista} · {g.n} viagens · {g.vol}m³</div></div><div style={{color:"#2ecc71",fontWeight:800,fontSize:15}}>{fmt(g.val)}</div></div>
              </Card>
            ))}
          </div>);
        })()}
        {subTab==="rel_periodo"&&(()=>{
          const lista=getPer(),tVol=lista.reduce((s,v)=>s+v.volumeM3,0),tVal=lista.reduce((s,v)=>s+v.valorTotal,0);
          return (<div>
            <div style={{display:"flex",gap:8,marginBottom:12}}>
              {["semana","mes"].map(p=>(
                <button key={p} onClick={()=>setRelPer(p)} style={{flex:1,padding:"8px",background:relPer===p?"#c4600a22":"#1a1e2a",border:"1px solid "+(relPer===p?"#c4600a":"#2a2f3f"),borderRadius:8,color:relPer===p?"#c4600a":"#e8e0d0",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif"}}>{p==="semana"?"Últimos 7 dias":"Este mês"}</button>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}><Stat label="VIAGENS" value={lista.length}/><Stat label="VOLUME" value={`${tVol}m³`} small/><Stat label="TOTAL" value={fmt(tVal)} accent="#2ecc71" small/></div>
            <SLabel>POR FRYTEIRO</SLabel>
            {grpCam(lista).map((g,i)=>(
              <Card key={i} style={{borderLeft:"3px solid #c4600a"}}><div style={{display:"flex",justifyContent:"space-between"}}><div><div style={{fontWeight:700}}>{g.placa}</div><div style={{fontSize:12,color:"#9090a0"}}>{g.freteiro} · {g.n} viagens · {g.vol}m³</div></div><div style={{color:"#2ecc71",fontWeight:800,fontSize:15}}>{fmt(g.val)}</div></div></Card>
            ))}
          </div>);
        })()}
        {subTab==="rel_destino"&&(()=>{
          const lista=relDest==="todos"?viagens:viagens.filter(v=>v.destino===relDest);
          return (<div>
            <Sel label="FILTRAR POR DESTINO" value={relDest} onChange={e=>setRelDest(e.target.value)}>
              <option value="todos">Todos os destinos</option>
              {destinos.map(d=><option key={d.id} value={d.nome}>{d.nome}</option>)}
            </Sel>
            <SLabel>VOLUME POR DESTINO</SLabel>
            {grpDest(lista).map((g,i)=>(
              <Card key={i} style={{borderLeft:"3px solid #5b9cf6"}}><div style={{display:"flex",justifyContent:"space-between"}}><div><div style={{fontWeight:700,fontSize:13}}>{g.dest}</div><div style={{fontSize:11,color:"#9090a0"}}>{g.km.toFixed(1)}km · {g.n} viagens · {g.vol}m³</div></div><div style={{color:"#2ecc71",fontWeight:800}}>{fmt(g.val)}</div></div></Card>
            ))}
          </div>);
        })()}

        {/* QR CODES */}
        {subTab==="qrcodes"&&(
          <div>
            <div style={{fontSize:12,color:"#9090a0",marginBottom:14,background:"#1a1e2a",borderRadius:10,padding:12,border:"1px solid #2a2f3f"}}>
              📋 Imprima estes QR Codes e cole em cada caminhão. O apontador escaneia para registrar a viagem instantaneamente.
            </div>
            {caminhoes.map(c=>(
              <Card key={c.id} style={{marginBottom:12}}>
                <div style={{display:"flex",gap:14,alignItems:"center"}}>
                  <img src={qrUrl(`CASCALHOTRACK:${c.placa}:${c.id}`)} alt={c.placa}
                    style={{width:90,height:90,borderRadius:6,border:"3px solid #c4600a",flexShrink:0}}/>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:800,fontSize:18,color:"#c4600a",letterSpacing:2}}>{c.placa}</div>
                    <div style={{fontSize:12,color:"#e8e0d0",marginTop:2}}>{c.motorista}</div>
                    <div style={{fontSize:11,color:"#9090a0"}}>{c.freteiro}</div>
                    <div style={{fontSize:11,color:"#c4600a",marginTop:4}}>Caçamba: {c.volumeM3}m³</div>
                  </div>
                </div>
                <button onClick={()=>window.open(qrUrl(`CASCALHOTRACK:${c.placa}:${c.id}`),"_blank")}
                  style={{width:"100%",marginTop:10,padding:"8px",background:"#1e2230",border:"1px solid #c4600a44",borderRadius:7,color:"#c4600a",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif"}}>
                  🖨️ ABRIR QR PARA IMPRIMIR
                </button>
              </Card>
            ))}
          </div>
        )}

        {/* CONFIG */}
        {subTab==="config"&&(
          <div>
            <SLabel>TABELA DE PREÇOS (m³ × km × R$)</SLabel>
            {tabela.map((f,i)=>(
              <Card key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div><div style={{fontWeight:700,fontSize:12}}>{f.faixaLabel}</div></div>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <span style={{color:"#9090a0",fontSize:11}}>R$</span>
                  <input type="number" value={f.valorM3xM} step="0.01"
                    onChange={e=>{const t=[...tabela];t[i]={...t[i],valorM3xM:parseFloat(e.target.value)||0};setTabela(t);}}
                    style={{width:65,padding:"5px 6px",background:"#0f1117",border:"1px solid #2a2f3f",borderRadius:6,color:"#2ecc71",fontWeight:800,fontSize:14,fontFamily:"'Barlow Condensed',sans-serif",textAlign:"right"}}/>
                  <span style={{color:"#7a7a8a",fontSize:10}}>/m³</span>
                </div>
              </Card>
            ))}

            <SLabel mt={16}>GOOGLE MAPS API KEY</SLabel>
            <Card style={{border:apiKey?"1px solid #2ecc7144":"1px solid #f0a50044"}}>
              <div style={{fontSize:11,color:"#9090a0",marginBottom:6}}>Para calcular distância real pela estrada quando houver internet.</div>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <input type="text" value={apiKey} onChange={e=>setApiKey(e.target.value)} placeholder="Cole sua chave aqui..."
                  style={{flex:1,padding:"8px 10px",background:"#0f1117",border:"1px solid #2a2f3f",borderRadius:7,color:"#e8e0d0",fontSize:12,fontFamily:"'Barlow Condensed',sans-serif"}}/>
                {apiKey&&<span style={{color:"#2ecc71",fontSize:18}}>✅</span>}
              </div>
            </Card>

            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8,marginTop:16}}>
              <SLabel>DESTINOS</SLabel>
              <Btn onClick={()=>setShowAddDest(!showAddDest)} style={{fontSize:11,padding:"5px 12px"}}>+ NOVO</Btn>
            </div>
            {showAddDest&&(
              <Card style={{border:"1px solid #c4600a44",marginBottom:10}}>
                <div style={{fontSize:12,fontWeight:700,color:"#c4600a",marginBottom:8}}>NOVO DESTINO</div>
                <Inp label="NOME DO LOCAL" value={nDNome} onChange={e=>setNDNome(e.target.value)} placeholder="Ex: Fazenda Boa Vista"/>
                <Inp label="DISTÂNCIA EM METROS" type="number" value={nDKm} onChange={e=>setNDKm(e.target.value)} placeholder="Ex: 4200"/>
                <Btn full onClick={addDest}>SALVAR</Btn>
              </Card>
            )}
            {destinos.map(d=>(
              <Card key={d.id}>
                {editDestId===d.id?(
                  <div>
                    <div style={{fontSize:12,fontWeight:700,color:"#c4600a",marginBottom:8}}>✏️ EDITAR DESTINO</div>
                    <Inp label="NOME DO LOCAL" value={editDestNome} onChange={e=>setEditDestNome(e.target.value)}/>
                    <Inp label="DISTÂNCIA EM METROS" type="number" value={editDestKm} onChange={e=>setEditDestKm(e.target.value)}/>
                    <div style={{display:"flex",gap:8}}>
                      <Btn full onClick={salvarDest} color="#2ecc71">SALVAR ✅</Btn>
                      <Btn onClick={()=>setEditDestId(null)} color="#555" style={{padding:"9px 16px"}}>CANCELAR</Btn>
                    </div>
                  </div>
                ):(
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div>
                      <div style={{fontWeight:700}}>{d.nome}</div>
                      <div style={{fontSize:12,color:"#9090a0"}}>{d.distanciaM}m ({(d.distanciaM/1000).toFixed(1)}km)</div>
                      <span style={{background:"#c4600a22",color:"#c4600a",border:"1px solid #c4600a55",borderRadius:5,padding:"2px 8px",fontSize:10,fontWeight:700}}>{getFaixa(d.distanciaM,tabela).faixaLabel}</span>
                    </div>
                    <div style={{display:"flex",gap:6}}>
                      <button onClick={()=>abrirEditDest(d)} style={{background:"#1e2230",border:"1px solid #2a2f3f",borderRadius:6,padding:"5px 10px",color:"#c4600a",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif"}}>✏️</button>
                      <button onClick={()=>excluirDest(d.id)} style={{background:"#1e2230",border:"1px solid #2a2f3f",borderRadius:6,padding:"5px 10px",color:"#e74c3c",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif"}}>🗑️</button>
                    </div>
                  </div>
                )}
              </Card>
            ))}

            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8,marginTop:16}}>
              <SLabel>CAMINHÕES</SLabel>
              <Btn onClick={()=>setShowAddCam(!showAddCam)} style={{fontSize:11,padding:"5px 12px"}}>+ NOVO</Btn>
            </div>
            {showAddCam&&(
              <Card style={{border:"1px solid #c4600a44",marginBottom:10}}>
                <div style={{fontSize:12,fontWeight:700,color:"#c4600a",marginBottom:8}}>NOVO CAMINHÃO</div>
                <Inp label="PLACA"               value={nPlaca} onChange={e=>setNPlaca(e.target.value)}  placeholder="ABC-1234"/>
                <Inp label="MOTORISTA"           value={nMot}   onChange={e=>setNMot(e.target.value)}    placeholder="Nome do motorista"/>
                <Inp label="FRETEIRO / EMPRESA"  value={nFret}  onChange={e=>setNFret(e.target.value)}   placeholder="Nome da empresa"/>
                <Inp label="VOLUME CAÇAMBA (m³)" type="number" value={nVol} onChange={e=>setNVol(e.target.value)} placeholder="Ex: 12"/>
                <Inp label="WHATSAPP (com DDD)"  type="tel"    value={nWa}  onChange={e=>setNWa(e.target.value)}  placeholder="65999990001"/>
                <Btn full onClick={addCam}>SALVAR</Btn>
              </Card>
            )}
            {caminhoes.map(c=>(
              <Card key={c.id}>
                {editCamId===c.id?(
                  <div>
                    <div style={{fontSize:12,fontWeight:700,color:"#c4600a",marginBottom:8}}>✏️ EDITAR CAMINHÃO</div>
                    <Inp label="PLACA"               value={editCamPlaca} onChange={e=>setEditCamPlaca(e.target.value)}/>
                    <Inp label="MOTORISTA"           value={editCamMot}   onChange={e=>setEditCamMot(e.target.value)}/>
                    <Inp label="FRETEIRO / EMPRESA"  value={editCamFret}  onChange={e=>setEditCamFret(e.target.value)}/>
                    <Inp label="VOLUME CAÇAMBA (m³)" type="number" value={editCamVol} onChange={e=>setEditCamVol(e.target.value)}/>
                    <Inp label="WHATSAPP (com DDD)"  type="tel"    value={editCamWa}  onChange={e=>setEditCamWa(e.target.value)}/>
                    <div style={{display:"flex",gap:8}}>
                      <Btn full onClick={salvarCam} color="#2ecc71">SALVAR ✅</Btn>
                      <Btn onClick={()=>setEditCamId(null)} color="#555" style={{padding:"9px 16px"}}>CANCELAR</Btn>
                    </div>
                  </div>
                ):(
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <img src={qrUrl(`CASCALHOTRACK:${c.placa}:${c.id}`)} alt={c.placa} style={{width:48,height:48,borderRadius:6,border:"2px solid #c4600a44",flexShrink:0}}/>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:700}}>{c.placa}</div>
                      <div style={{fontSize:12,color:"#9090a0"}}>{c.motorista} · {c.freteiro}</div>
                      <div style={{fontSize:11,color:"#c4600a"}}>{c.volumeM3}m³ {c.whatsapp&&"· 📱 "+c.whatsapp}</div>
                    </div>
                    <div style={{display:"flex",gap:6,flexShrink:0}}>
                      <button onClick={()=>abrirEditCam(c)} style={{background:"#1e2230",border:"1px solid #2a2f3f",borderRadius:6,padding:"5px 10px",color:"#c4600a",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif"}}>✏️</button>
                      <button onClick={()=>excluirCam(c.id)} style={{background:"#1e2230",border:"1px solid #2a2f3f",borderRadius:6,padding:"5px 10px",color:"#e74c3c",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif"}}>🗑️</button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
      {toast&&<div style={{position:"fixed",bottom:20,left:"50%",transform:"translateX(-50%)",background:toast.type==="error"?"#c0392b":"#27ae60",color:"#fff",padding:"10px 20px",borderRadius:10,fontSize:13,fontWeight:700,boxShadow:"0 4px 20px rgba(0,0,0,0.4)",zIndex:999,whiteSpace:"nowrap",fontFamily:"'Barlow Condensed',sans-serif"}}>{toast.msg}</div>}
    </div>
  );
}

// ── APP ROOT ─────────────────────────────────────────────────────
export default function App() {
  const [usuario,   setUsuario]   = useState(null);
  const [viagens,   setViagens]   = useState(VIAGENS_SEED);
  const [caminhoes, setCaminhoes] = useState(CAMINHOES_INIT);
  const [destinos,  setDestinos]  = useState(DESTINOS_INIT);
  const [tabela,    setTabela]    = useState(TABELA_INIT);
  const [apiKey,    setApiKey]    = useState("");
  const [navTab,    setNavTab]    = useState("principal");

  if(!usuario) return <TelaLogin onLogin={u=>{setUsuario(u);setNavTab("principal");}}/>;

  const PERFIL_TABS={
    apontador:[{key:"principal",icon:"📋",label:"Apontador"}],
    motorista: [{key:"principal",icon:"🚛",label:"Minhas Viagens"}],
    gestor:    [{key:"principal",icon:"📊",label:"Gestor"},{key:"apontador",icon:"📋",label:"Apontador"}],
  };
  const tabs=PERFIL_TABS[usuario.perfil]||[];
  const PERFIL_COLOR={gestor:"#5b9cf6",apontador:"#c4600a",motorista:"#2ecc71"};

  return (
    <div style={{fontFamily:"'Barlow Condensed',sans-serif",background:"#0f1117",minHeight:"100vh",color:"#e8e0d0",maxWidth:430,margin:"0 auto"}}>
      <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&display=swap" rel="stylesheet"/>
      <div style={{background:"linear-gradient(135deg,#c4600a,#8c3e00)",padding:"14px 20px 10px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-20,right:-20,width:100,height:100,borderRadius:"50%",background:"rgba(255,255,255,0.06)",pointerEvents:"none"}}/>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:22}}>⛏️</span>
          <div>
            <div style={{fontSize:18,fontWeight:800,letterSpacing:1,lineHeight:1}}>CASCALHO<span style={{color:"#ffe0b0"}}>TRACK</span></div>
            <div style={{fontSize:9,opacity:0.8,letterSpacing:2}}>CONTROLE DE TRANSPORTE · QR CODE</div>
          </div>
          <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:10}}>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:10,opacity:0.7}}>{usuario.nome}</div>
              <div style={{fontSize:11,fontWeight:700,color:PERFIL_COLOR[usuario.perfil]||"#fff",background:"rgba(0,0,0,0.3)",borderRadius:4,padding:"1px 6px"}}>{usuario.perfil.toUpperCase()}</div>
            </div>
            <button onClick={()=>setUsuario(null)} style={{background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.3)",borderRadius:8,padding:"7px 14px",color:"#fff",fontSize:13,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,letterSpacing:0.5}}>← SAIR</button>
          </div>
        </div>
      </div>
      {tabs.length>1&&(
        <div style={{display:"flex",background:"#181c26",borderBottom:"2px solid #c4600a22"}}>
          {tabs.map(t=>(
            <button key={t.key} onClick={()=>setNavTab(t.key)} style={{
              flex:1,padding:"9px 2px",background:"none",border:"none",
              color:navTab===t.key?"#c4600a":"#7a7a8a",fontSize:10,fontWeight:700,
              letterSpacing:0.5,cursor:"pointer",
              borderBottom:navTab===t.key?"2px solid #c4600a":"2px solid transparent",
              fontFamily:"'Barlow Condensed',sans-serif"
            }}>{t.icon} {t.label}</button>
          ))}
        </div>
      )}
      {usuario.perfil==="motorista"&&<TelaMotorista viagens={viagens} caminhoes={caminhoes} setCaminhoes={setCaminhoes} usuario={usuario} onSair={()=>setUsuario(null)}/>}
      {(usuario.perfil==="apontador"||(usuario.perfil==="gestor"&&navTab==="apontador"))&&
        <TelaApontador viagens={viagens} setViagens={setViagens} caminhoes={caminhoes} destinos={destinos} tabela={tabela} apiKey={apiKey} usuario={usuario}/>}
      {usuario.perfil==="gestor"&&navTab==="principal"&&
        <TelaGestor viagens={viagens} setViagens={setViagens} caminhoes={caminhoes} setCaminhoes={setCaminhoes} destinos={destinos} setDestinos={setDestinos} tabela={tabela} setTabela={setTabela} apiKey={apiKey} setApiKey={setApiKey}/>}
    </div>
  );
}
