import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://jmddqkgunjmyzvxlsoyh.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptZGRxa2d1bmpteXp2eGxzb3loIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0MjAwNTksImV4cCI6MjA5Mjk5NjA1OX0.-Yplo5stftVDHNBNGZXXXNG7my9zRaECSshsZtbwi8w";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const LOJAS = [
  { id:"isaura",    nome:"Isaura Parente",    cor:"#E8533A" },
  { id:"vila_rio",  nome:"Vila Rio",           cor:"#3A8FE8" },
  { id:"via_verde", nome:"Via Verde Shopping", cor:"#2ECC71" },
  { id:"parque",    nome:"Parque",             cor:"#9B59B6" },
  { id:"parada",    nome:"Parada Obrigatória", cor:"#F39C12" },
  { id:"producao",  nome:"Produção",           cor:"#1ABC9C" },
];

const CANAIS = ["CARTÃO","IFOOD","PIX E TRANSFERÊNCIA","DINHEIRO","ALIMENTAÇÃO","VENDA INTERNA","CONTRATOS"];
const PERFIS_MENU = {
  admin:        ["dashboard","producao","financeiro","contas","compras","premio","avaliacao","cadastros","config"],
  financeiro:   ["financeiro","contas"],
  producao:     ["producao"],
  compras:      ["compras"],
  gerente_loja: ["financeiro","contas"],
};
const MENU = [
  { id:"dashboard", label:"Dashboard",       icon:"📊" },
  { id:"producao",  label:"Produção",         icon:"🏭" },
  { id:"financeiro",label:"Financeiro",       icon:"💰" },
  { id:"contas",    label:"Contas a Pagar",   icon:"📋" },
  { id:"compras",   label:"Compras",          icon:"🛒" },
  { id:"premio",    label:"Prêmio Gerentes",  icon:"🏆" },
  { id:"avaliacao", label:"Avaliação Anual",  icon:"📈" },
  { id:"cadastros", label:"Cadastros",        icon:"🗂️" },
  { id:"config",    label:"Configurações",    icon:"⚙️" },
];

// Subgrupos que compõem cada indicador
const SUBS_CMV   = ["INSUMOS GERAIS","BEBIDAS","EMBALAGEM","PROTEÍNAS PRODUÇÃO","PICOLÉS E OUTROS","LISTA DE MERCADO","PEDIDO FORNECEDOR","VERDURAS E LEGUMES","CERVEJA/REFRIGERANTE/ÁGUA","CHOPP BRAHMA","CHOPP HEINEKEN","CHOPP ALTANEIRA","BEBIDAS QUENTES","EMBALAGEM PERSONALIZADA","EMBALAGEM LOCAL","CARNE BOVINA","PEIXE","CAMARÃO","PICANHA SUÍNA","FRANGO","CALABRESA","BACON","PRESUNTO","QUEIJO","BATATA PALITO","MANTEIGA"];
const SUBS_CMO   = ["SALÁRIOS","FÉRIAS","FGTS","INSS","RESCISÕES E ACORDOS","DIÁRIAS","MOTOBOYS","FOLHA DE PAGAMENTO"];
const SUBS_LUZ   = ["ENERGIA","ÁGUA","GÁS DE COZINHA"];
const SUBS_OCUP  = ["ALUGUEL","CONDOMÍNIO","IPTU"];
const SUBS_FIXOS = [...SUBS_CMO,"ALUGUEL","CONDOMÍNIO","IPTU","ENERGIA","ÁGUA","INTERNET","SISTEMA","GÁS DE COZINHA","CELULAR","DETETIZAÇÃO E DESENTUPIDOR"];

const fmt  = v => v!=null ? Number(v).toLocaleString("pt-BR",{style:"currency",currency:"BRL"}) : "—";
const pct  = v => v!=null ? `${Number(v).toFixed(1)}%` : "—";
const sem  = (v,m=30) => v<=m?"#2ECC71":v<=m+5?"#F39C12":"#E74C3C";
const hoje = () => new Date().toISOString().slice(0,10);

// Máscara de moeda brasileira
function useMoeda(inicial="") {
  const [val,setVal] = useState(inicial);
  const onChange = useCallback((e) => {
    let n = e.target.value.replace(/\D/g,"");
    if(!n){ setVal(""); return; }
    n = (parseInt(n,10)/100).toFixed(2);
    setVal(Number(n).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2}));
  },[]);
  const numerico = parseFloat(val.replace(/\./g,"").replace(",","."))||0;
  return [val,onChange,numerico,setVal];
}

const S = {
  app:  { fontFamily:"'DM Sans','Segoe UI',sans-serif", background:"#0F1117", minHeight:"100vh", color:"#E8E8E8", display:"flex" },
  sb:   { width:220, background:"#161922", borderRight:"1px solid #252A35", display:"flex", flexDirection:"column", padding:"24px 0", position:"fixed", top:0, left:0, bottom:0, zIndex:100, overflowY:"auto" },
  logo: { padding:"0 20px 24px", borderBottom:"1px solid #252A35", marginBottom:16 },
  nav:  a=>({ display:"flex", alignItems:"center", gap:10, padding:"10px 20px", cursor:"pointer", fontSize:13, fontWeight:a?600:400, color:a?"#FF6B35":"#8090A8", background:a?"rgba(255,107,53,0.08)":"transparent", borderLeft:a?"2px solid #FF6B35":"2px solid transparent" }),
  main: { marginLeft:220, flex:1, display:"flex", flexDirection:"column" },
  top:  { background:"#161922", borderBottom:"1px solid #252A35", padding:"14px 28px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:50 },
  cont: { padding:28, flex:1 },
  card: { background:"#1C2130", borderRadius:12, border:"1px solid #252A35", padding:20 },
  cT:   { fontSize:12, fontWeight:600, color:"#5A6070", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:12 },
  g:    n=>({ display:"grid", gridTemplateColumns:`repeat(${n},1fr)`, gap:16 }),
  kV:   { fontSize:24, fontWeight:700, lineHeight:1 },
  kL:   { fontSize:12, color:"#5A6070", marginTop:4 },
  btn:  v=>({ padding:"8px 16px", borderRadius:8, border:"none", cursor:"pointer", fontSize:13, fontWeight:600, background:v==="primary"?"#FF6B35":v==="danger"?"#E74C3C":v==="success"?"#2ECC71":v==="ghost"?"transparent":"#252A35", color:v==="ghost"?"#8090A8":"#fff" }),
  inp:  { background:"#0F1117", border:"1px solid #252A35", borderRadius:8, padding:"10px 12px", color:"#E8E8E8", fontSize:13, width:"100%", outline:"none", boxSizing:"border-box", height:40 },
  sel:  { background:"#0F1117", border:"1px solid #252A35", borderRadius:8, padding:"10px 12px", color:"#E8E8E8", fontSize:13, width:"100%", outline:"none", height:40 },
  lbl:  { fontSize:12, color:"#8090A8", marginBottom:4, display:"block" },
  tbl:  { width:"100%", borderCollapse:"collapse", fontSize:13 },
  th:   { textAlign:"left", padding:"10px 12px", color:"#5A6070", fontSize:11, fontWeight:600, textTransform:"uppercase", borderBottom:"1px solid #252A35" },
  td:   { padding:"10px 12px", borderBottom:"1px solid #1A1F2B", color:"#C8D0DC" },
  badge:c=>({ display:"inline-block", padding:"3px 8px", borderRadius:4, fontSize:11, fontWeight:600, background:c+"22", color:c }),
  row:  { display:"grid", gap:12, alignItems:"end" },
};

function Login({onLogin}) {
  const [email,setE]=useState(""); const [senha,setS]=useState(""); const [erro,setErr]=useState(""); const [load,setL]=useState(false);
  async function go() {
    setL(true); setErr("");
    const {data,error}=await supabase.auth.signInWithPassword({email,password:senha});
    if(error){setErr("E-mail ou senha inválidos"); setL(false); return;}
    const {data:u}=await supabase.from("usuarios").select("*").eq("email",email).single();
    onLogin({...data.user,...(u||{perfil:"admin"})});
    setL(false);
  }
  return (
    <div style={{...S.app,alignItems:"center",justifyContent:"center"}}>
      <div style={{background:"#161922",borderRadius:16,border:"1px solid #252A35",padding:40,width:360,margin:"auto"}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{fontSize:32,marginBottom:8}}>🥩</div>
          <div style={{fontSize:18,fontWeight:700,color:"#FF6B35",letterSpacing:"0.05em",textTransform:"uppercase"}}>PICANHA MIX</div>
          <div style={{fontSize:12,color:"#5A6070",marginTop:4}}>Sistema de Gestão</div>
        </div>
        <div style={{marginBottom:12}}><label style={S.lbl}>E-mail</label><input style={S.inp} type="email" value={email} onChange={e=>setE(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()} placeholder="seu@email.com"/></div>
        <div style={{marginBottom:20}}><label style={S.lbl}>Senha</label><input style={S.inp} type="password" value={senha} onChange={e=>setS(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()} placeholder="••••••••"/></div>
        {erro&&<div style={{color:"#E74C3C",fontSize:12,marginBottom:12}}>{erro}</div>}
        <button style={{...S.btn("primary"),width:"100%",padding:"10px 0"}} onClick={go} disabled={load}>{load?"Entrando…":"Entrar"}</button>
      </div>
    </div>
  );
}function Dashboard({usuario}) {
  const [vendas,setV]=useState([]); const [envios,setE]=useState([]); const [despesas,setD]=useState([]); const [load,setL]=useState(true);
  const [mes,setM]=useState(new Date().toISOString().slice(0,7)); const [lojaFiltro,setLF]=useState("");

  useEffect(()=>{
    (async()=>{
      setL(true);
      const ini=mes+"-01", fim=mes+"-31";
      const [v,e,d]=await Promise.all([
        supabase.from("vendas").select("*").gte("data",ini).lte("data",fim),
        supabase.from("envios_producao").select("*").gte("data",ini).lte("data",fim),
        supabase.from("despesas_caixa").select("*").gte("data",ini).lte("data",fim),
      ]);
      setV(v.data||[]); setE(e.data||[]); setD(d.data||[]); setL(false);
    })();
  },[mes]);

  function calcLoja(lojaId) {
    const vLoja = lojaId ? vendas.filter(v=>v.loja_id===lojaId) : vendas;
    const eLoja = lojaId ? envios.filter(e=>e.loja_id===lojaId) : envios;
    const dLoja = lojaId ? despesas.filter(d=>d.loja_id===lojaId) : despesas;

    const fat = vLoja.reduce((s,v)=>s+Number(v.valor),0);

    // CMV = envios producao + despesas subgrupo CMV
    const cmvEnvios = eLoja.reduce((s,e)=>s+Number(e.valor_total||e.quantidade*e.valor_unitario),0);
    const cmvDesp   = dLoja.filter(d=>SUBS_CMV.some(s=>d.categoria?.toUpperCase().includes(s))).reduce((s,d)=>s+Number(d.valor),0);
    const cmvVal    = cmvEnvios + cmvDesp;
    const cmvPct    = fat>0?(cmvVal/fat)*100:0;

    // CMO
    const cmoVal  = dLoja.filter(d=>SUBS_CMO.some(s=>d.categoria?.toUpperCase().includes(s))).reduce((s,d)=>s+Number(d.valor),0);
    const cmoPct  = fat>0?(cmoVal/fat)*100:0;

    // Prime Cost
    const primeVal = cmvVal+cmoVal;
    const primePct = fat>0?(primeVal/fat)*100:0;

    // Luz Agua Gas
    const lugVal  = dLoja.filter(d=>SUBS_LUZ.some(s=>d.categoria?.toUpperCase().includes(s))).reduce((s,d)=>s+Number(d.valor),0);
    const lugPct  = fat>0?(lugVal/fat)*100:0;

    // Custo Ocupacao
    const ocupVal = dLoja.filter(d=>SUBS_OCUP.some(s=>d.categoria?.toUpperCase().includes(s))).reduce((s,d)=>s+Number(d.valor),0);
    const ocupPct = fat>0?(ocupVal/fat)*100:0;

    // Custos Fixos
    const fixosVal = dLoja.filter(d=>SUBS_FIXOS.some(s=>d.categoria?.toUpperCase().includes(s))).reduce((s,d)=>s+Number(d.valor),0);

    // Margem Contribuicao
    const mcEfetiva  = fat>0?((fat-cmvVal-cmoVal)/fat)*100:0;
    const mcEsperada = 45;

    // Ponto Equilibrio
    const peEfetivo  = mcEfetiva>0  ? fixosVal/(mcEfetiva/100)  : 0;
    const peEsperado = mcEsperada>0 ? fixosVal/(mcEsperada/100) : 0;

    // Detalhes CMV por categoria
    const detCMV = {};
    dLoja.filter(d=>SUBS_CMV.some(s=>d.categoria?.toUpperCase().includes(s))).forEach(d=>{
      const k=d.categoria||"Outros"; detCMV[k]=(detCMV[k]||0)+Number(d.valor);
    });
    if(cmvEnvios>0) detCMV["Proteínas (Produção)"]=(detCMV["Proteínas (Produção)"]||0)+cmvEnvios;

    // Detalhes CMO por categoria
    const detCMO = {};
    dLoja.filter(d=>SUBS_CMO.some(s=>d.categoria?.toUpperCase().includes(s))).forEach(d=>{
      const k=d.categoria||"Outros"; detCMO[k]=(detCMO[k]||0)+Number(d.valor);
    });

    return {fat,cmvVal,cmvPct,cmoVal,cmoPct,primeVal,primePct,lugVal,lugPct,ocupVal,ocupPct,fixosVal,mcEfetiva,mcEsperada,peEfetivo,peEsperado,detCMV,detCMO};
  }

  const [showDetCMV,setSDC]=useState(false); const [showDetCMO,setSDO]=useState(false);
  const dados = calcLoja(lojaFiltro);
  const {fat,cmvVal,cmvPct,cmoVal,cmoPct,primeVal,primePct,lugVal,lugPct,ocupVal,ocupPct,fixosVal,mcEfetiva,mcEsperada,peEfetivo,peEsperado,detCMV,detCMO} = dados;

  function KpiCard({label,val,pct,meta,icon,onDetail}) {
    const c = pct!=null ? sem(pct,meta||30) : "#E8E8E8";
    return (
      <div style={{...S.card,position:"relative"}}>
        <div style={{fontSize:18,marginBottom:6}}>{icon}</div>
        <div style={{...S.kV,color:c}}>{fmt(val)}</div>
        {pct!=null&&<div style={{fontSize:16,fontWeight:700,color:c,marginTop:2}}>{pct.toFixed(1)}%</div>}
        <div style={S.kL}>{label}{meta&&<span style={{color:"#3A4050"}}> (meta {meta}%)</span>}</div>
        {onDetail&&<button onClick={onDetail} style={{...S.btn("ghost"),fontSize:11,padding:"2px 6px",position:"absolute",top:12,right:12}}>▼ detalhes</button>}
      </div>
    );
  }

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24,flexWrap:"wrap",gap:12}}>
        <div><h2 style={{fontSize:20,fontWeight:700,margin:0}}>Dashboard</h2><div style={{fontSize:13,color:"#5A6070",marginTop:4}}>{lojaFiltro?LOJAS.find(l=>l.id===lojaFiltro)?.nome:"Todas as lojas"}</div></div>
        <div style={{display:"flex",gap:8}}>
          <input style={{...S.inp,width:150}} type="month" value={mes} onChange={e=>setM(e.target.value)}/>
          <select style={{...S.sel,width:200}} value={lojaFiltro} onChange={e=>setLF(e.target.value)}>
            <option value="">Todas as lojas</option>
            {LOJAS.filter(l=>l.id!=="producao").map(l=><option key={l.id} value={l.id}>{l.nome}</option>)}
          </select>
        </div>
      </div>

      {load?<div style={{color:"#5A6070",padding:20}}>Carregando…</div>:(
        <>
        {/* KPIs principais */}
        <div style={{...S.g(4),marginBottom:16}}>
          <div style={S.card}><div style={{fontSize:18,marginBottom:6}}>📈</div><div style={{...S.kV,color:"#E8E8E8"}}>{fmt(fat)}</div><div style={S.kL}>Faturamento Bruto</div></div>
          <KpiCard label="CMV" val={cmvVal} pct={cmvPct} meta={30} icon="🥩" onDetail={()=>setSDC(!showDetCMV)}/>
          <KpiCard label="CMO" val={cmoVal} pct={cmoPct} meta={25} icon="👥" onDetail={()=>setSDO(!showDetCMO)}/>
          <KpiCard label="Prime Cost" val={primeVal} pct={primePct} meta={58} icon="📊"/>
        </div>

        {/* Detalhe CMV */}
        {showDetCMV&&Object.keys(detCMV).length>0&&(
          <div style={{...S.card,marginBottom:16,borderColor:"#E8533A"}}>
            <div style={S.cT}>🥩 Detalhamento CMV</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
              {Object.entries(detCMV).sort((a,b)=>b[1]-a[1]).map(([k,v])=>(
                <div key={k} style={{background:"#0F1117",borderRadius:8,padding:"8px 12px",display:"flex",justifyContent:"space-between"}}>
                  <span style={{fontSize:12,color:"#8090A8"}}>{k}</span>
                  <span style={{fontSize:12,fontWeight:700}}>{fmt(v)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detalhe CMO */}
        {showDetCMO&&Object.keys(detCMO).length>0&&(
          <div style={{...S.card,marginBottom:16,borderColor:"#3A8FE8"}}>
            <div style={S.cT}>👥 Detalhamento CMO</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
              {Object.entries(detCMO).sort((a,b)=>b[1]-a[1]).map(([k,v])=>(
                <div key={k} style={{background:"#0F1117",borderRadius:8,padding:"8px 12px",display:"flex",justifyContent:"space-between"}}>
                  <span style={{fontSize:12,color:"#8090A8"}}>{k}</span>
                  <span style={{fontSize:12,fontWeight:700}}>{fmt(v)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{...S.g(4),marginBottom:16}}>
          <KpiCard label="Luz, Água e Gás" val={lugVal} pct={lugPct} meta={5} icon="⚡"/>
          <KpiCard label="Custo de Ocupação" val={ocupVal} pct={ocupPct} meta={10} icon="🏠"/>
          <div style={S.card}><div style={{fontSize:18,marginBottom:6}}>🔧</div><div style={{...S.kV}}>{fmt(fixosVal)}</div><div style={S.kL}>Custos Fixos</div></div>
          <div style={S.card}>
            <div style={{fontSize:18,marginBottom:6}}>💹</div>
            <div style={{display:"flex",gap:16}}>
              <div><div style={{...S.kV,color:"#2ECC71",fontSize:18}}>{mcEfetiva.toFixed(1)}%</div><div style={{fontSize:11,color:"#5A6070"}}>MC Efetiva</div></div>
              <div><div style={{...S.kV,color:"#3A8FE8",fontSize:18}}>{mcEsperada}%</div><div style={{fontSize:11,color:"#5A6070"}}>MC Esperada</div></div>
            </div>
            <div style={S.kL}>Margem de Contribuição</div>
          </div>
        </div>

        <div style={{...S.g(2),marginBottom:16}}>
          <div style={S.card}>
            <div style={S.cT}>⚖️ Ponto de Equilíbrio</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div style={{background:"#0F1117",borderRadius:8,padding:12}}>
                <div style={{fontSize:11,color:"#5A6070",marginBottom:4}}>PE Efetivo (MC {mcEfetiva.toFixed(1)}%)</div>
                <div style={{fontSize:18,fontWeight:700,color:"#F39C12"}}>{fmt(peEfetivo)}</div>
              </div>
              <div style={{background:"#0F1117",borderRadius:8,padding:12}}>
                <div style={{fontSize:11,color:"#5A6070",marginBottom:4}}>PE Esperado (MC 45%)</div>
                <div style={{fontSize:18,fontWeight:700,color:"#2ECC71"}}>{fmt(peEsperado)}</div>
              </div>
            </div>
          </div>

          {!lojaFiltro&&(
            <div style={S.card}>
              <div style={S.cT}>CMV por Loja</div>
              {LOJAS.filter(l=>l.id!=="producao").map(l=>{
                const d=calcLoja(l.id);
                if(d.fat===0) return null;
                return(
                  <div key={l.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:"1px solid #1A1F2B"}}>
                    <span style={{color:l.cor,fontSize:13}}>● {l.nome}</span>
                    <div style={{display:"flex",gap:12}}>
                      <span style={{fontSize:12,color:"#5A6070"}}>{fmt(d.fat)}</span>
                      <span style={{fontWeight:700,color:sem(d.cmvPct)}}>{d.cmvPct.toFixed(1)}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        </>
      )}
    </div>
  );
}function Producao({usuario}) {
  const [precos,setP]=useState([]); const [envios,setE]=useState([]); const [form,setF]=useState({loja_id:"",data:hoje(),item:"",quantidade:""});
  const [filtro,setFi]=useState({loja:"",data:hoje()}); const [saving,setSv]=useState(false);
  const ljs=usuario.perfil==="gerente_loja"?LOJAS.filter(l=>l.id===usuario.loja_id):LOJAS.filter(l=>l.id!=="producao");
  useEffect(()=>{ supabase.from("matriz_precos").select("*").eq("ativo",true).then(({data})=>setP(data||[])); },[]);
  useEffect(()=>{ load(); },[filtro]);
  async function load(){let q=supabase.from("envios_producao").select("*").eq("data",filtro.data).order("criado_em",{ascending:false}); if(filtro.loja)q=q.eq("loja_id",filtro.loja); const{data}=await q; setE(data||[]);}
  async function salvar(){if(!form.loja_id||!form.item||!form.quantidade)return; setSv(true); const pr=precos.find(p=>p.item===form.item); await supabase.from("envios_producao").insert({loja_id:form.loja_id,data:form.data,item:form.item,quantidade:Number(form.quantidade),valor_unitario:pr?.valor||0,usuario_id:usuario.id}); setF(f=>({...f,item:"",quantidade:""})); load(); setSv(false);}
  async function excluir(id){await supabase.from("envios_producao").delete().eq("id",id); load();}
  const prSel=precos.find(p=>p.item===form.item);
  const total=envios.reduce((s,e)=>s+Number(e.valor_total||e.quantidade*e.valor_unitario),0);
  return (
    <div>
      <h2 style={{fontSize:20,fontWeight:700,marginBottom:20}}>Módulo Produção — Envios às Lojas</h2>
      <div style={{...S.card,marginBottom:24}}>
        <div style={S.cT}>Registrar Envio</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 2fr 1fr auto",gap:12,alignItems:"end"}}>
          <div><label style={S.lbl}>Loja</label><select style={S.sel} value={form.loja_id} onChange={e=>setF(f=>({...f,loja_id:e.target.value}))}><option value="">Selecione…</option>{ljs.map(l=><option key={l.id} value={l.id}>{l.nome}</option>)}</select></div>
          <div><label style={S.lbl}>Data</label><input style={S.inp} type="date" value={form.data} onChange={e=>setF(f=>({...f,data:e.target.value}))}/></div>
          <div><label style={S.lbl}>Produto</label><select style={S.sel} value={form.item} onChange={e=>setF(f=>({...f,item:e.target.value}))}><option value="">Selecione…</option>{precos.map(p=><option key={p.item} value={p.item}>{p.item} — {fmt(p.valor)}/{p.unidade}</option>)}</select></div>
          <div><label style={S.lbl}>Quantidade</label><input style={S.inp} type="number" min="0" step="0.5" placeholder="0" value={form.quantidade} onChange={e=>setF(f=>({...f,quantidade:e.target.value}))}/></div>
          <button style={S.btn("primary")} onClick={salvar} disabled={saving}>{saving?"…":"+ Registrar"}</button>
        </div>
        {prSel&&form.quantidade&&<div style={{marginTop:10,fontSize:13,color:"#8090A8"}}>Valor: <strong style={{color:"#FF6B35"}}>{fmt(prSel.valor*Number(form.quantidade))}</strong></div>}
      </div>
      <div style={S.card}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div style={S.cT}>Envios — {fmt(total)}</div>
          <div style={{display:"flex",gap:8}}><input style={{...S.inp,width:150}} type="date" value={filtro.data} onChange={e=>setFi(f=>({...f,data:e.target.value}))}/><select style={{...S.sel,width:180}} value={filtro.loja} onChange={e=>setFi(f=>({...f,loja:e.target.value}))}><option value="">Todas as lojas</option>{ljs.map(l=><option key={l.id} value={l.id}>{l.nome}</option>)}</select></div>
        </div>
        <table style={S.tbl}><thead><tr>{["Loja","Produto","Qtd","Unit.","Total",""].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
        <tbody>{envios.length===0?<tr><td colSpan={6} style={{...S.td,color:"#5A6070",textAlign:"center"}}>Nenhum envio registrado</td></tr>:envios.map(e=>{const l=LOJAS.find(x=>x.id===e.loja_id); const tot=Number(e.valor_total||e.quantidade*e.valor_unitario); return(<tr key={e.id}><td style={{...S.td,color:l?.cor}}>{l?.nome}</td><td style={S.td}>{e.item}</td><td style={S.td}>{e.quantidade}</td><td style={S.td}>{fmt(Number(e.valor_unitario))}</td><td style={{...S.td,fontWeight:700}}>{fmt(tot)}</td><td style={S.td}>{usuario.perfil==="admin"&&<button style={{...S.btn("ghost"),padding:"2px 8px",fontSize:11,color:"#E74C3C"}} onClick={()=>excluir(e.id)}>✕</button>}</td></tr>);})}</tbody>
        </table>
      </div>
    </div>
  );
}

function Financeiro({usuario}) {
  const [aba,setA]=useState("vendas"); const [vendas,setV]=useState([]); const [desp,setD]=useState([]);
  const [filtro,setFi]=useState({loja:"",data:hoje()});
  const [fv,setFv]=useState({loja_id:"",data:hoje(),canal:"",valor:""});
  const [fd,setFd]=useState({loja_id:"",data:hoje(),fornecedor_id:"",grupo_id:"",subgrupo_id:"",observacao:""});
  const [valV,onValV,numV,setValV]=useMoeda();
  const [valD,onValD,numD,setValD]=useMoeda();
  const [sv,setSv]=useState(false);
  const [fornecedores,setForn]=useState([]); const [grupos,setGrupos]=useState([]); const [subgrupos,setSubs]=useState([]);
  const ljs=usuario.perfil==="gerente_loja"?LOJAS.filter(l=>l.id===usuario.loja_id):LOJAS.filter(l=>l.id!=="producao");

  useEffect(()=>{
    supabase.from("fornecedores").select("*").eq("ativo",true).order("nome").then(({data})=>setForn(data||[]));
    supabase.from("grupos_despesa").select("*").eq("ativo",true).then(({data})=>setGrupos(data||[]));
  },[]);
  useEffect(()=>{ if(fd.grupo_id) supabase.from("subgrupos_despesa").select("*").eq("grupo_id",fd.grupo_id).eq("ativo",true).then(({data})=>setSubs(data||[])); else setSubs([]); },[fd.grupo_id]);
  useEffect(()=>{ ldV(); ldD(); },[filtro]);

  async function ldV(){let q=supabase.from("vendas").select("*").eq("data",filtro.data).order("criado_em",{ascending:false}); if(filtro.loja)q=q.eq("loja_id",filtro.loja); const{data}=await q; setV(data||[]);}
  async function ldD(){let q=supabase.from("despesas_caixa").select("*").eq("data",filtro.data).order("criado_em",{ascending:false}); if(filtro.loja)q=q.eq("loja_id",filtro.loja); const{data}=await q; setD(data||[]);}

  async function svV(){if(!fv.loja_id||!fv.canal||!numV)return; setSv(true); await supabase.from("vendas").insert({loja_id:fv.loja_id,data:fv.data,canal:fv.canal,valor:numV,usuario_id:usuario.id}); setFv(f=>({...f,canal:""})); setValV(""); ldV(); setSv(false);}
  async function svD(){if(!fd.loja_id||!numD)return; setSv(true); const forn=fornecedores.find(f=>f.id===Number(fd.fornecedor_id)); const grp=grupos.find(g=>g.id===Number(fd.grupo_id)); const sub=subgrupos.find(s=>s.id===Number(fd.subgrupo_id)); await supabase.from("despesas_caixa").insert({loja_id:fd.loja_id,data:fd.data,categoria:sub?.nome||grp?.nome||"",valor:numD,observacao:`${forn?.nome||""} ${fd.observacao}`.trim(),usuario_id:usuario.id}); setFd(f=>({...f,fornecedor_id:"",grupo_id:"",subgrupo_id:"",observacao:""})); setValD(""); ldD(); setSv(false);}

  const totV=vendas.reduce((s,v)=>s+Number(v.valor),0);
  const totD=desp.reduce((s,d)=>s+Number(d.valor),0);
  const resumo=CANAIS.map(c=>({c,t:vendas.filter(v=>v.canal===c).reduce((s,v)=>s+Number(v.valor),0)})).filter(x=>x.t>0);

  return (
    <div>
      <h2 style={{fontSize:20,fontWeight:700,marginBottom:20}}>Módulo Financeiro</h2>
      <div style={{display:"flex",gap:4,marginBottom:20,background:"#1C2130",borderRadius:10,padding:4,width:"fit-content"}}>
        {[["vendas","💰 Vendas"],["despesas","📋 Despesas"]].map(([id,lb])=><button key={id} onClick={()=>setA(id)} style={{...S.btn(aba===id?"primary":"ghost"),borderRadius:8}}>{lb}</button>)}
      </div>
      <div style={{display:"flex",gap:8,marginBottom:20}}>
        <input style={{...S.inp,width:150}} type="date" value={filtro.data} onChange={e=>setFi(f=>({...f,data:e.target.value}))}/>
        <select style={{...S.sel,width:200}} value={filtro.loja} onChange={e=>setFi(f=>({...f,loja:e.target.value}))}><option value="">Todas as lojas</option>{ljs.map(l=><option key={l.id} value={l.id}>{l.nome}</option>)}</select>
      </div>

      {aba==="vendas"&&<>
        <div style={{...S.card,marginBottom:24}}>
          <div style={S.cT}>Lançar Venda</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr auto",gap:12,alignItems:"end"}}>
            <div><label style={S.lbl}>Loja</label><select style={S.sel} value={fv.loja_id} onChange={e=>setFv(f=>({...f,loja_id:e.target.value}))}><option value="">Selecione…</option>{ljs.map(l=><option key={l.id} value={l.id}>{l.nome}</option>)}</select></div>
            <div><label style={S.lbl}>Data</label><input style={S.inp} type="date" value={fv.data} onChange={e=>setFv(f=>({...f,data:e.target.value}))}/></div>
            <div><label style={S.lbl}>Canal</label><select style={S.sel} value={fv.canal} onChange={e=>setFv(f=>({...f,canal:e.target.value}))}><option value="">Selecione…</option>{CANAIS.map(c=><option key={c}>{c}</option>)}</select></div>
            <div><label style={S.lbl}>Valor (R$)</label><input style={{...S.inp,fontFamily:"monospace"}} placeholder="0,00" value={valV} onChange={onValV}/></div>
            <button style={S.btn("primary")} onClick={svV} disabled={sv}>+ Lançar</button>
          </div>
        </div>
        <div style={S.g(2)}>
          <div style={S.card}><div style={S.cT}>Resumo por Canal — {fmt(totV)}</div>{resumo.length===0?<div style={{color:"#5A6070",fontSize:13}}>Nenhum lançamento ainda</div>:resumo.map(x=><div key={x.c} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #1A1F2B"}}><span>{x.c}</span><span style={{fontWeight:700}}>{fmt(x.t)}</span></div>)}{resumo.length>0&&<div style={{display:"flex",justifyContent:"space-between",padding:"10px 0 0",fontWeight:700,color:"#FF6B35"}}><span>TOTAL</span><span>{fmt(totV)}</span></div>}</div>
          <div style={S.card}><div style={S.cT}>Últimos Lançamentos</div><table style={S.tbl}><thead><tr>{["Loja","Canal","Valor"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead><tbody>{vendas.slice(0,8).map(v=>{const l=LOJAS.find(x=>x.id===v.loja_id); return<tr key={v.id}><td style={{...S.td,color:l?.cor}}>{l?.nome}</td><td style={S.td}>{v.canal}</td><td style={{...S.td,fontWeight:600}}>{fmt(Number(v.valor))}</td></tr>;})} {vendas.length===0&&<tr><td colSpan={3} style={{...S.td,color:"#5A6070",textAlign:"center"}}>Nenhum lançamento</td></tr>}</tbody></table></div>
        </div>
      </>}

      {aba==="despesas"&&<>
        <div style={{...S.card,marginBottom:24}}>
          <div style={S.cT}>Lançar Despesa</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:12,marginBottom:12}}>
            <div><label style={S.lbl}>Loja</label><select style={S.sel} value={fd.loja_id} onChange={e=>setFd(f=>({...f,loja_id:e.target.value}))}><option value="">Selecione…</option>{ljs.map(l=><option key={l.id} value={l.id}>{l.nome}</option>)}</select></div>
            <div><label style={S.lbl}>Data</label><input style={S.inp} type="date" value={fd.data} onChange={e=>setFd(f=>({...f,data:e.target.value}))}/></div>
            <div><label style={S.lbl}>Fornecedor</label><select style={S.sel} value={fd.fornecedor_id} onChange={e=>setFd(f=>({...f,fornecedor_id:e.target.value}))}><option value="">Selecione…</option>{fornecedores.map(f=><option key={f.id} value={f.id}>{f.nome}</option>)}</select></div>
            <div><label style={S.lbl}>Valor (R$)</label><input style={{...S.inp,fontFamily:"monospace"}} placeholder="0,00" value={valD} onChange={onValD}/></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 2fr auto",gap:12,alignItems:"end"}}>
            <div><label style={S.lbl}>Grupo</label><select style={S.sel} value={fd.grupo_id} onChange={e=>setFd(f=>({...f,grupo_id:e.target.value,subgrupo_id:""}))}><option value="">Selecione…</option>{grupos.map(g=><option key={g.id} value={g.id}>{g.nome}</option>)}</select></div>
            <div><label style={S.lbl}>Subgrupo</label><select style={S.sel} value={fd.subgrupo_id} onChange={e=>setFd(f=>({...f,subgrupo_id:e.target.value}))} disabled={!fd.grupo_id}><option value="">Selecione…</option>{subgrupos.map(s=><option key={s.id} value={s.id}>{s.nome}</option>)}</select></div>
            <div><label style={S.lbl}>Observação</label><input style={S.inp} placeholder="opcional" value={fd.observacao} onChange={e=>setFd(f=>({...f,observacao:e.target.value}))}/></div>
            <button style={S.btn("primary")} onClick={svD} disabled={sv}>+ Lançar</button>
          </div>
        </div>
        <div style={S.card}><div style={S.cT}>Despesas do Dia — {fmt(totD)}</div>
          <table style={S.tbl}><thead><tr>{["Loja","Categoria","Valor","Obs."].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
          <tbody>{desp.map(d=>{const l=LOJAS.find(x=>x.id===d.loja_id); return<tr key={d.id}><td style={{...S.td,color:l?.cor}}>{l?.nome}</td><td style={S.td}>{d.categoria}</td><td style={{...S.td,fontWeight:600}}>{fmt(Number(d.valor))}</td><td style={{...S.td,color:"#5A6070"}}>{d.observacao||"—"}</td></tr>;})} {desp.length===0&&<tr><td colSpan={4} style={{...S.td,color:"#5A6070",textAlign:"center"}}>Nenhum lançamento</td></tr>}</tbody>
          </table>
        </div>
      </>}
    </div>
  );
}function Contas({usuario}) {
  const [contas,setC]=useState([]); const [load,setL]=useState(true); const [show,setShow]=useState(false);
  const [pagId,setPId]=useState(null); const [editId,setEditId]=useState(null);
  const [fSt,setFSt]=useState(""); const [fLj,setFLj]=useState(""); const [sv,setSv]=useState(false); const [arq,setArq]=useState(null);
  const [fornecedores,setForn]=useState([]); const [grupos,setGrupos]=useState([]); const [subgrupos,setSubs]=useState([]);
  const [valF,onValF,numF,setValF]=useMoeda();
  const [form,setForm]=useState({fornecedor_id:"",loja_id:"",grupo_id:"",subgrupo_id:"",tipo:"",vencimento:"",forma_pagamento:"PIX",numero_nf:"",chave_pix:"",codigo_barras:"",conferido_por:"",data_chegada:""});
  const [fp,setFp]=useState({data_pagamento:hoje(),banco:"BANCO STONE"});

  useEffect(()=>{
    carregar();
    supabase.from("fornecedores").select("*").eq("ativo",true).order("nome").then(({data})=>setForn(data||[]));
    supabase.from("grupos_despesa").select("*").eq("ativo",true).then(({data})=>setGrupos(data||[]));
  },[fSt,fLj]);

  useEffect(()=>{ if(form.grupo_id) supabase.from("subgrupos_despesa").select("*").eq("grupo_id",form.grupo_id).then(({data})=>setSubs(data||[])); else setSubs([]); },[form.grupo_id]);

  async function carregar(){setL(true); let q=supabase.from("contas_pagar").select("*").order("vencimento",{ascending:true}); if(fSt)q=q.eq("status",fSt); if(fLj)q=q.ilike("loja_id",`%${fLj}%`); const{data}=await q; setC(data||[]); setL(false);}

  async function salvarNova(){if(!numF)return; setSv(true);
    const forn=fornecedores.find(f=>f.id===Number(form.fornecedor_id));
    const grp=grupos.find(g=>g.id===Number(form.grupo_id));
    const sub=subgrupos.find(s=>s.id===Number(form.subgrupo_id));
    await supabase.from("contas_pagar").insert({
      fornecedor:forn?.nome||"", loja_id:form.loja_id, grupo:grp?.nome||"", tipo:sub?.nome||form.tipo,
      valor:numF, vencimento:form.vencimento, forma_pagamento:form.forma_pagamento,
      numero_nf:form.numero_nf, chave_pix:form.chave_pix, codigo_barras:form.codigo_barras,
      conferido_por:form.conferido_por, data_chegada:form.data_chegada||null,
      inserido_por:usuario.nome, status:"PENDENTE",
    });
    setForm({fornecedor_id:"",loja_id:"",grupo_id:"",subgrupo_id:"",tipo:"",vencimento:"",forma_pagamento:"PIX",numero_nf:"",chave_pix:"",codigo_barras:"",conferido_por:"",data_chegada:""});
    setValF(""); setShow(false); carregar(); setSv(false);
  }

  async function salvarEdicao(){if(!numF||!editId)return; setSv(true);
    const forn=fornecedores.find(f=>f.id===Number(form.fornecedor_id));
    const grp=grupos.find(g=>g.id===Number(form.grupo_id));
    const sub=subgrupos.find(s=>s.id===Number(form.subgrupo_id));
    await supabase.from("contas_pagar").update({
      fornecedor:forn?.nome||"", loja_id:form.loja_id, grupo:grp?.nome||"", tipo:sub?.nome||form.tipo,
      valor:numF, vencimento:form.vencimento, forma_pagamento:form.forma_pagamento,
      numero_nf:form.numero_nf, chave_pix:form.chave_pix, codigo_barras:form.codigo_barras,
      conferido_por:form.conferido_por, data_chegada:form.data_chegada||null,
    }).eq("id",editId);
    setEditId(null); setValF(""); setShow(false); carregar(); setSv(false);
  }

  function abrirEdicao(c){
    setEditId(c.id);
    setForm({fornecedor_id:"",loja_id:c.loja_id||"",grupo_id:"",subgrupo_id:"",tipo:c.tipo||"",vencimento:c.vencimento||"",forma_pagamento:c.forma_pagamento||"PIX",numero_nf:c.numero_nf||"",chave_pix:c.chave_pix||"",codigo_barras:c.codigo_barras||"",conferido_por:c.conferido_por||"",data_chegada:c.data_chegada||""});
    setValF(c.valor?Number(c.valor).toLocaleString("pt-BR",{minimumFractionDigits:2}):"");
    setShow(true); window.scrollTo({top:0,behavior:"smooth"});
  }

  async function excluir(id){ if(!window.confirm("Excluir esta conta?"))return; await supabase.from("contas_pagar").delete().eq("id",id); carregar();}

  async function pagar(id){setSv(true); let url=null;
    if(arq){const ext=arq.name.split(".").pop(); const path=`comprovantes/${id}.${ext}`; await supabase.storage.from("documentos").upload(path,arq,{upsert:true}); const{data:pub}=supabase.storage.from("documentos").getPublicUrl(path); url=pub.publicUrl;}
    await supabase.from("contas_pagar").update({status:"PAGO",data_pagamento:fp.data_pagamento,banco:fp.banco,...(url&&{comprovante_url:url})}).eq("id",id);
    setPId(null); setArq(null); carregar(); setSv(false);
  }

  const pend=contas.filter(c=>c.status==="PENDENTE"); const pagos=contas.filter(c=>c.status==="PAGO");
  const contaAtual=contas.find(c=>c.id===pagId);

  const FormContas=()=>(
    <div style={{...S.card,marginBottom:24,borderColor:editId?"#3A8FE8":"#FF6B35"}}>
      <div style={S.cT}>{editId?"✏️ Editar Conta":"+ Nova Conta"}</div>
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:12,marginBottom:12}}>
        <div><label style={S.lbl}>Fornecedor</label><select style={S.sel} value={form.fornecedor_id} onChange={e=>setForm(f=>({...f,fornecedor_id:e.target.value}))}><option value="">Selecione…</option>{fornecedores.map(f=><option key={f.id} value={f.id}>{f.nome}</option>)}</select></div>
        <div><label style={S.lbl}>Loja</label><select style={S.sel} value={form.loja_id} onChange={e=>setForm(f=>({...f,loja_id:e.target.value}))}><option value="">Selecione…</option>{[...LOJAS,{id:"administrativo",nome:"ADMINISTRATIVO"}].map(l=><option key={l.id} value={l.id}>{l.nome}</option>)}</select></div>
        <div><label style={S.lbl}>Valor (R$)</label><input style={{...S.inp,fontFamily:"monospace"}} placeholder="0,00" value={valF} onChange={onValF}/></div>
        <div><label style={S.lbl}>Vencimento</label><input style={S.inp} type="date" value={form.vencimento} onChange={e=>setForm(f=>({...f,vencimento:e.target.value}))}/></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:12,marginBottom:12}}>
        <div><label style={S.lbl}>Grupo</label><select style={S.sel} value={form.grupo_id} onChange={e=>setForm(f=>({...f,grupo_id:e.target.value,subgrupo_id:""}))}><option value="">Selecione…</option>{grupos.map(g=><option key={g.id} value={g.id}>{g.nome}</option>)}</select></div>
        <div><label style={S.lbl}>Subgrupo</label><select style={S.sel} value={form.subgrupo_id} onChange={e=>setForm(f=>({...f,subgrupo_id:e.target.value}))} disabled={!form.grupo_id}><option value="">Selecione…</option>{subgrupos.map(s=><option key={s.id} value={s.id}>{s.nome}</option>)}</select></div>
        <div><label style={S.lbl}>Nº NF / Boleto</label><input style={S.inp} value={form.numero_nf} onChange={e=>setForm(f=>({...f,numero_nf:e.target.value}))}/></div>
        <div><label style={S.lbl}>Conferido por</label><input style={S.inp} value={form.conferido_por} onChange={e=>setForm(f=>({...f,conferido_por:e.target.value}))}/></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:12,marginBottom:12}}>
        <div><label style={S.lbl}>Forma de Pagamento</label>
          <select style={S.sel} value={form.forma_pagamento} onChange={e=>setForm(f=>({...f,forma_pagamento:e.target.value}))}>
            {["PIX","BOLETO","TED/DOC","DINHEIRO","CARTÃO"].map(x=><option key={x}>{x}</option>)}
          </select>
        </div>
        <div><label style={S.lbl}>Data de Chegada</label><input style={S.inp} type="date" value={form.data_chegada} onChange={e=>setForm(f=>({...f,data_chegada:e.target.value}))}/></div>
        <div><label style={S.lbl}>📎 Nota Fiscal</label><input style={{...S.inp,cursor:"pointer"}} type="file" accept=".pdf,.png,.jpg"/></div>
        <div style={{display:"flex",gap:8,alignItems:"end"}}>
          <button style={{...S.btn("primary"),flex:1}} onClick={editId?salvarEdicao:salvarNova} disabled={sv}>{sv?"Salvando…":editId?"Salvar Edição":"Salvar"}</button>
          {editId&&<button style={S.btn("secondary")} onClick={()=>{setEditId(null);setShow(false);setValF("");}}>Cancelar</button>}
        </div>
      </div>
      {(form.forma_pagamento==="PIX")&&(
        <div><label style={S.lbl}>🔑 Chave PIX (para copiar na hora do pagamento)</label><input style={{...S.inp,fontFamily:"monospace"}} placeholder="CPF, e-mail, telefone ou chave aleatória" value={form.chave_pix} onChange={e=>setForm(f=>({...f,chave_pix:e.target.value}))}/></div>
      )}
      {(form.forma_pagamento==="BOLETO")&&(
        <div><label style={S.lbl}>📊 Código de Barras (use o leitor ou digite)</label><input style={{...S.inp,fontFamily:"monospace",letterSpacing:"0.05em"}} placeholder="000000000000000000000000000000000000000000000" value={form.codigo_barras} onChange={e=>{const v=e.target.value; setForm(f=>({...f,codigo_barras:v}));}}/>
      )}
    </div>
  );

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
        <div><h2 style={{fontSize:20,fontWeight:700,margin:0}}>Contas a Pagar</h2><div style={{fontSize:13,color:"#5A6070",marginTop:4}}>Organograma de Pagamentos</div></div>
        {(usuario.perfil==="admin"||usuario.perfil==="financeiro")&&<button style={S.btn("primary")} onClick={()=>{setShow(!show);setEditId(null);setValF("");}}>+ Nova Conta</button>}
      </div>
      <div style={{...S.g(3),marginBottom:24}}>
        <div style={S.card}><div style={S.cT}>Pendente</div><div style={{...S.kV,color:"#F39C12"}}>{fmt(pend.reduce((s,c)=>s+Number(c.valor),0))}</div><div style={S.kL}>{pend.length} registros</div></div>
        <div style={S.card}><div style={S.cT}>Pago</div><div style={{...S.kV,color:"#2ECC71"}}>{fmt(pagos.reduce((s,c)=>s+Number(c.valor),0))}</div><div style={S.kL}>{pagos.length} registros</div></div>
        <div style={S.card}><div style={S.cT}>Total</div><div style={S.kV}>{fmt(contas.reduce((s,c)=>s+Number(c.valor),0))}</div><div style={S.kL}>{contas.length} registros</div></div>
      </div>

      {show&&<FormContas/>}

      {pagId&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:300}}>
        <div style={{...S.card,width:460,borderColor:"#2ECC71"}}>
          <div style={{fontSize:16,fontWeight:700,marginBottom:4}}>✅ Confirmar Pagamento</div>
          <div style={{fontSize:13,color:"#5A6070",marginBottom:16}}>{contaAtual?.fornecedor} — {fmt(Number(contaAtual?.valor))}</div>
          {contaAtual?.chave_pix&&<div style={{background:"#0F1117",borderRadius:8,padding:12,marginBottom:12}}>
            <div style={{fontSize:11,color:"#5A6070",marginBottom:4}}>🔑 Chave PIX</div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontFamily:"monospace",fontSize:13}}>{contaAtual.chave_pix}</span>
              <button style={{...S.btn("primary"),padding:"4px 10px",fontSize:11}} onClick={()=>navigator.clipboard.writeText(contaAtual.chave_pix)}>📋 Copiar</button>
            </div>
          </div>}
          {contaAtual?.codigo_barras&&<div style={{background:"#0F1117",borderRadius:8,padding:12,marginBottom:12}}>
            <div style={{fontSize:11,color:"#5A6070",marginBottom:4}}>📊 Código de Barras</div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
              <span style={{fontFamily:"monospace",fontSize:11,wordBreak:"break-all"}}>{contaAtual.codigo_barras}</span>
              <button style={{...S.btn("primary"),padding:"4px 10px",fontSize:11,whiteSpace:"nowrap"}} onClick={()=>navigator.clipboard.writeText(contaAtual.codigo_barras)}>📋 Copiar</button>
            </div>
          </div>}
          <div style={{marginBottom:12}}><label style={S.lbl}>Data do Pagamento</label><input style={S.inp} type="date" value={fp.data_pagamento} onChange={e=>setFp(f=>({...f,data_pagamento:e.target.value}))}/></div>
          <div style={{marginBottom:12}}><label style={S.lbl}>Banco</label><select style={S.sel} value={fp.banco} onChange={e=>setFp(f=>({...f,banco:e.target.value}))}>{["BANCO STONE","BANCO IFOOD","BANCO DO BRASIL","CAIXA","ITAÚ","BRADESCO","SICOOB"].map(b=><option key={b}>{b}</option>)}</select></div>
          <div style={{marginBottom:16}}><label style={S.lbl}>📎 Comprovante</label><input style={{...S.inp,cursor:"pointer"}} type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={e=>setArq(e.target.files[0])}/></div>
          <div style={{display:"flex",gap:8}}>
            <button style={{...S.btn("primary"),flex:1}} onClick={()=>pagar(pagId)} disabled={sv}>{sv?"Salvando…":"Confirmar Pago"}</button>
            <button style={{...S.btn("secondary"),flex:1}} onClick={()=>setPId(null)}>Cancelar</button>
          </div>
        </div>
      </div>}

      <div style={S.card}>
        <div style={{display:"flex",gap:8,marginBottom:16}}>
          <select style={{...S.sel,width:160}} value={fSt} onChange={e=>setFSt(e.target.value)}><option value="">Todos</option><option value="PENDENTE">Pendente</option><option value="PAGO">Pago</option></select>
          <input style={{...S.inp,width:200}} placeholder="Filtrar por loja…" value={fLj} onChange={e=>setFLj(e.target.value)}/>
        </div>
        {load?<div style={{color:"#5A6070"}}>Carregando…</div>:(
        <table style={S.tbl}><thead><tr>{["Fornecedor","Loja","Grupo","Valor","Vencimento","Forma Pgto","Inserido por","Status","Ações"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
        <tbody>{contas.map(c=>(
          <tr key={c.id}>
            <td style={{...S.td,fontWeight:600}}>{c.fornecedor}</td>
            <td style={S.td}>{c.loja_id}</td>
            <td style={S.td}>{c.grupo}</td>
            <td style={{...S.td,fontWeight:700}}>{fmt(Number(c.valor))}</td>
            <td style={S.td}>{c.vencimento}</td>
            <td style={S.td}><span style={S.badge(c.forma_pagamento==="PIX"?"#2ECC71":c.forma_pagamento==="BOLETO"?"#F39C12":"#3A8FE8")}>{c.forma_pagamento}</span></td>
            <td style={{...S.td,fontSize:11,color:"#5A6070"}}>{c.inserido_por||"—"}</td>
            <td style={S.td}><span style={S.badge(c.status==="PAGO"?"#2ECC71":"#F39C12")}>{c.status}</span></td>
            <td style={S.td}>
              <div style={{display:"flex",gap:6}}>
                {c.status==="PENDENTE"&&usuario.perfil==="admin"&&<button style={{...S.btn("primary"),padding:"4px 8px",fontSize:11}} onClick={()=>setPId(c.id)}>Pagar</button>}
                {c.status==="PAGO"&&<span style={{fontSize:11,color:"#2ECC71"}}>✓ {c.data_pagamento}</span>}
                <button style={{...S.btn("secondary"),padding:"4px 8px",fontSize:11}} onClick={()=>abrirEdicao(c)}>✏️</button>
                {usuario.perfil==="admin"&&<button style={{...S.btn("danger"),padding:"4px 8px",fontSize:11}} onClick={()=>excluir(c.id)}>🗑️</button>}
                {c.comprovante_url&&<a href={c.comprovante_url} target="_blank" rel="noreferrer" style={{fontSize:11,color:"#3A8FE8"}}>📎</a>}
              </div>
            </td>
          </tr>
        ))}{contas.length===0&&<tr><td colSpan={9} style={{...S.td,color:"#5A6070",textAlign:"center"}}>Nenhum registro</td></tr>}</tbody>
        </table>)}
      </div>
    </div>
  );
}function Cadastros({usuario}) {
  const [aba,setA]=useState("fornecedores");
  const [fornecedores,setForn]=useState([]); const [grupos,setGrupos]=useState([]);
  const [novoForn,setNF]=useState(""); const [novoGrupo,setNG]=useState(""); const [novoSub,setNS]=useState({grupo_id:"",nome:""});
  const [sv,setSv]=useState(false); const [busca,setBusca]=useState("");

  useEffect(()=>{ carregarForn(); carregarGrupos(); },[]);

  async function carregarForn(){ const{data}=await supabase.from("fornecedores").select("*").eq("ativo",true).order("nome"); setForn(data||[]); }
  async function carregarGrupos(){ const{data}=await supabase.from("grupos_despesa").select("*, subgrupos_despesa(*)").eq("ativo",true); setGrupos(data||[]); }
  async function addForn(){ if(!novoForn.trim())return; setSv(true); await supabase.from("fornecedores").insert({nome:novoForn.trim().toUpperCase()}); setNF(""); carregarForn(); setSv(false); }
  async function delForn(id){ await supabase.from("fornecedores").update({ativo:false}).eq("id",id); carregarForn(); }
  async function addGrupo(){ if(!novoGrupo.trim())return; setSv(true); await supabase.from("grupos_despesa").insert({nome:novoGrupo.trim().toUpperCase()}); setNG(""); carregarGrupos(); setSv(false); }
  async function addSub(){ if(!novoSub.grupo_id||!novoSub.nome.trim())return; setSv(true); await supabase.from("subgrupos_despesa").insert({grupo_id:Number(novoSub.grupo_id),nome:novoSub.nome.trim().toUpperCase()}); setNS({grupo_id:"",nome:""}); carregarGrupos(); setSv(false); }
  async function delSub(id){ await supabase.from("subgrupos_despesa").update({ativo:false}).eq("id",id); carregarGrupos(); }

  const fornFiltrados=fornecedores.filter(f=>f.nome.toLowerCase().includes(busca.toLowerCase()));

  return (
    <div>
      <h2 style={{fontSize:20,fontWeight:700,marginBottom:20}}>Cadastros</h2>
      <div style={{display:"flex",gap:4,marginBottom:20,background:"#1C2130",borderRadius:10,padding:4,width:"fit-content"}}>
        {[["fornecedores","🏢 Fornecedores"],["grupos","📂 Grupos e Subgrupos"]].map(([id,lb])=>(
          <button key={id} onClick={()=>setA(id)} style={{...S.btn(aba===id?"primary":"ghost"),borderRadius:8}}>{lb}</button>
        ))}
      </div>
      {aba==="fornecedores"&&(
        <div style={S.g(2)}>
          <div style={S.card}>
            <div style={S.cT}>Adicionar Fornecedor</div>
            <div style={{display:"flex",gap:8,alignItems:"end"}}>
              <div style={{flex:1}}><label style={S.lbl}>Nome</label><input style={S.inp} placeholder="Nome em maiúsculas…" value={novoForn} onChange={e=>setNF(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addForn()}/></div>
              <button style={S.btn("primary")} onClick={addForn} disabled={sv}>+ Adicionar</button>
            </div>
            <div style={{marginTop:12,fontSize:12,color:"#5A6070"}}>{fornecedores.length} fornecedores cadastrados</div>
          </div>
          <div style={S.card}><div style={S.cT}>Buscar</div><input style={S.inp} placeholder="Buscar fornecedor…" value={busca} onChange={e=>setBusca(e.target.value)}/></div>
          <div style={{...S.card,gridColumn:"1 / -1"}}>
            <div style={S.cT}>Fornecedores ({fornFiltrados.length})</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,maxHeight:400,overflowY:"auto"}}>
              {fornFiltrados.map(f=>(
                <div key={f.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:"#0F1117",borderRadius:8,padding:"8px 12px"}}>
                  <span style={{fontSize:13}}>{f.nome}</span>
                  <button style={{...S.btn("ghost"),padding:"2px 6px",fontSize:11,color:"#E74C3C"}} onClick={()=>delForn(f.id)}>✕</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {aba==="grupos"&&(
        <div>
          <div style={{...S.g(2),marginBottom:24}}>
            <div style={S.card}>
              <div style={S.cT}>Novo Grupo</div>
              <div style={{display:"flex",gap:8,alignItems:"end"}}>
                <div style={{flex:1}}><label style={S.lbl}>Nome</label><input style={S.inp} placeholder="Ex: CMV, FIXOS…" value={novoGrupo} onChange={e=>setNG(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addGrupo()}/></div>
                <button style={S.btn("primary")} onClick={addGrupo} disabled={sv}>+ Adicionar</button>
              </div>
            </div>
            <div style={S.card}>
              <div style={S.cT}>Novo Subgrupo</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr auto",gap:8,alignItems:"end"}}>
                <div><label style={S.lbl}>Grupo</label><select style={S.sel} value={novoSub.grupo_id} onChange={e=>setNS(f=>({...f,grupo_id:e.target.value}))}><option value="">Selecione…</option>{grupos.map(g=><option key={g.id} value={g.id}>{g.nome}</option>)}</select></div>
                <div><label style={S.lbl}>Nome</label><input style={S.inp} placeholder="Ex: SALÁRIOS…" value={novoSub.nome} onChange={e=>setNS(f=>({...f,nome:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&addSub()}/></div>
                <button style={S.btn("primary")} onClick={addSub} disabled={sv}>+</button>
              </div>
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            {grupos.map(g=>(
              <div key={g.id} style={S.card}>
                <div style={{fontWeight:700,fontSize:14,color:"#FF6B35",marginBottom:12}}>📂 {g.nome}</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
                  {(g.subgrupos_despesa||[]).filter(s=>s.ativo!==false).map(s=>(
                    <div key={s.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:"#0F1117",borderRadius:8,padding:"8px 12px"}}>
                      <span style={{fontSize:12}}>{s.nome}</span>
                      <button style={{...S.btn("ghost"),padding:"2px 6px",fontSize:11,color:"#E74C3C"}} onClick={()=>delSub(s.id)}>✕</button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Config({usuario}) {
  const [users,setU]=useState([]); const [precos,setP]=useState([]); const [show,setShow]=useState(false); const [nu,setNu]=useState({nome:"",email:"",perfil:"financeiro",loja_id:"",senha:""}); const [sv,setSv]=useState(false); const [msg,setMsg]=useState("");
  useEffect(()=>{ supabase.from("usuarios").select("*").then(({data})=>setU(data||[])); supabase.from("matriz_precos").select("*").eq("ativo",true).then(({data})=>setP(data||[])); },[]);
  async function criar(){if(!nu.email||!nu.senha||!nu.nome)return; setSv(true); setMsg(""); const{data:sd,error:se}=await supabase.auth.signUp({email:nu.email,password:nu.senha}); if(se){setMsg("Erro: "+se.message); setSv(false); return;} if(sd?.user)await supabase.from("usuarios").insert({id:sd.user.id,nome:nu.nome,email:nu.email,perfil:nu.perfil,loja_id:nu.loja_id||null}); setMsg("✅ Usuário criado!"); setNu({nome:"",email:"",perfil:"financeiro",loja_id:"",senha:""}); supabase.from("usuarios").select("*").then(({data})=>setU(data||[])); setSv(false);}
  return (
    <div>
      <h2 style={{fontSize:20,fontWeight:700,marginBottom:20}}>Configurações</h2>
      <div style={{...S.g(2),marginBottom:24}}>
        <div style={S.card}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><div style={S.cT}>👥 Usuários</div><button style={{...S.btn("primary"),padding:"4px 10px",fontSize:12}} onClick={()=>setShow(!show)}>+ Novo</button></div>
          {show&&<div style={{background:"#0F1117",borderRadius:8,padding:12,marginBottom:12}}><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}><div><label style={S.lbl}>Nome</label><input style={S.inp} value={nu.nome} onChange={e=>setNu(f=>({...f,nome:e.target.value}))}/></div><div><label style={S.lbl}>E-mail</label><input style={S.inp} type="email" value={nu.email} onChange={e=>setNu(f=>({...f,email:e.target.value}))}/></div><div><label style={S.lbl}>Senha inicial</label><input style={S.inp} type="password" value={nu.senha} onChange={e=>setNu(f=>({...f,senha:e.target.value}))}/></div><div><label style={S.lbl}>Perfil</label><select style={S.sel} value={nu.perfil} onChange={e=>setNu(f=>({...f,perfil:e.target.value}))}>{["admin","financeiro","producao","compras","gerente_loja"].map(p=><option key={p}>{p}</option>)}</select></div>{nu.perfil==="gerente_loja"&&<div><label style={S.lbl}>Loja</label><select style={S.sel} value={nu.loja_id} onChange={e=>setNu(f=>({...f,loja_id:e.target.value}))}><option value="">Selecione…</option>{LOJAS.map(l=><option key={l.id} value={l.id}>{l.nome}</option>)}</select></div>}</div>{msg&&<div style={{fontSize:12,color:"#2ECC71",marginBottom:8}}>{msg}</div>}<button style={{...S.btn("primary"),width:"100%"}} onClick={criar} disabled={sv}>{sv?"Criando…":"Criar Usuário"}</button></div>}
          <table style={S.tbl}><thead><tr>{["Nome","Perfil","Loja"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead><tbody>{users.map(u=><tr key={u.id}><td style={{...S.td,fontWeight:600}}>{u.nome}</td><td style={S.td}><span style={S.badge(u.perfil==="admin"?"#FF6B35":"#3A8FE8")}>{u.perfil}</span></td><td style={{...S.td,color:"#5A6070"}}>{u.loja_id||"Todas"}</td></tr>)}{users.length===0&&<tr><td colSpan={3} style={{...S.td,color:"#5A6070"}}>Nenhum usuário ainda</td></tr>}</tbody></table>
        </div>
        <div style={S.card}><div style={S.cT}>🥩 Matriz de Preços</div><div style={{maxHeight:320,overflowY:"auto"}}><table style={S.tbl}><thead><tr>{["Item","Valor","Un."].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead><tbody>{precos.map(p=><tr key={p.id}><td style={{...S.td,fontSize:12}}>{p.item}</td><td style={{...S.td,fontWeight:600}}>{fmt(Number(p.valor))}</td><td style={{...S.td,color:"#5A6070"}}>{p.unidade}</td></tr>)}</tbody></table></div></div>
      </div>
    </div>
  );
}

export default function App() {
  const [usuario,setU]=useState(null); const [pagina,setP]=useState("dashboard"); const [check,setChk]=useState(true);
  useEffect(()=>{ supabase.auth.getSession().then(async({data:{session}})=>{ if(session){const{data:u}=await supabase.from("usuarios").select("*").eq("email",session.user.email).single(); if(u)setU({...session.user,...u});} setChk(false); }); },[]);
  async function logout(){await supabase.auth.signOut(); setU(null);}
  if(check) return <div style={{...S.app,alignItems:"center",justifyContent:"center",color:"#5A6070"}}>Carregando…</div>;
  if(!usuario) return <Login onLogin={u=>{setU(u); setP((PERFIS_MENU[u.perfil]||["dashboard"])[0]);}}/>;
  const perfil=usuario.perfil||"admin";
  const menu=MENU.filter(m=>(PERFIS_MENU[perfil]||["dashboard"]).includes(m.id));
  const cur=menu.find(m=>m.id===pagina)||menu[0];
  const render=()=>{ switch(pagina){case"dashboard":return<Dashboard usuario={usuario}/>; case"producao":return<Producao usuario={usuario}/>; case"financeiro":return<Financeiro usuario={usuario}/>; case"contas":return<Contas usuario={usuario}/>; case"cadastros":return<Cadastros usuario={usuario}/>; case"config":return<Config usuario={usuario}/>; default:return<div style={{...S.card,color:"#5A6070",marginTop:20}}>Módulo em desenvolvimento.</div>;} };
  return (
    <div style={S.app}>
      <div style={S.sb}>
        <div style={S.logo}><div style={{fontSize:22,marginBottom:6}}>🥩</div><div style={{fontSize:14,fontWeight:700,color:"#FF6B35",textTransform:"uppercase",letterSpacing:"0.05em"}}>Picanha Mix</div><div style={{fontSize:11,color:"#5A6070",marginTop:2}}>Sistema de Gestão</div></div>
        {menu.map(m=><div key={m.id} style={S.nav(pagina===m.id)} onClick={()=>setP(m.id)}><span>{m.icon}</span><span>{m.label}</span></div>)}
        <div style={{flex:1}}/>
        <div style={{padding:"16px 20px",borderTop:"1px solid #252A35"}}><div style={{fontSize:12,color:"#5A6070"}}>Logado como</div><div style={{fontSize:13,fontWeight:600}}>{usuario.nome}</div><div style={{fontSize:11,color:"#FF6B35",marginBottom:8}}>{perfil}</div><button style={{...S.btn("ghost"),padding:"4px 0",fontSize:12}} onClick={logout}>Sair →</button></div>
      </div>
      <div style={S.main}>
        <div style={S.top}><div style={{fontSize:14,color:"#5A6070"}}>{cur?.icon} {cur?.label}</div><div style={{fontSize:13,color:"#5A6070"}}>{new Date().toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</div></div>
        <div style={S.cont}>{render()}</div>
      </div>
    </div>
  );
}
