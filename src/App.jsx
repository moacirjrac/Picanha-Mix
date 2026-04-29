import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://jmddqkgunjmyzvxlsoyh.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptZGRxa2d1bmpteXp2eGxzb3loIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0MjAwNTksImV4cCI6MjA5Mjk5NjA1OX0.-Yplo5stftVDHNBNGZXXXNG7my9zRaECSshsZtbwi8w";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const LOJAS = [
  { id:"isaura",    nome:"Isaura Parente",       cor:"#E8533A" },
  { id:"vila_rio",  nome:"Vila Rio",              cor:"#3A8FE8" },
  { id:"via_verde", nome:"Via Verde Shopping",    cor:"#2ECC71" },
  { id:"parque",    nome:"Parque",                cor:"#9B59B6" },
  { id:"parada",    nome:"Parada Obrigatória",    cor:"#F39C12" },
  { id:"producao",  nome:"Produção",              cor:"#1ABC9C" },
];

const CANAIS = ["CARTÃO","IFOOD","PIX E TRANSFERÊNCIA","DINHEIRO","ALIMENTAÇÃO","VENDA INTERNA","CONTRATOS"];
const CATEGORIAS = ["INSUMOS GERAIS","BEBIDAS NÃO ALCOÓLICAS","BEBIDAS ALCOÓLICAS","MATERIAL DE LIMPEZA","EMBALAGEM","SACOLAS E CAIXAS","PAPELARIA","FOLHA DE PAGAMENTO","DIÁRIAS","ALIMENTAÇÃO","FÉRIAS","RESCISÕES E ACORDOS","FGTS","MOTOBOYS","ALUGUEL","CONDOMÍNIO","ENERGIA","ÁGUA","INTERNET","GÁS","SISTEMA PDV","DETETIZAÇÃO","MANUTENÇÃO DE EQUIPAMENTOS","SERVIÇOS","UNIFORMES E EPI","COMBUSTÍVEL"];
const GRUPOS = ["CMV","FIXOS_E_CONTRATOS","ADMINISTRATIVO","IMPOSTOS_TRIBUTOS_E_TAXAS","FOLHA_E_RH"];
const PERFIS_MENU = { admin:["dashboard","producao","financeiro","contas","compras","premio","avaliacao","config"], financeiro:["financeiro","contas"], producao:["producao"], compras:["compras"], gerente_loja:["financeiro","contas"] };
const MENU = [{ id:"dashboard",label:"Dashboard",icon:"📊"},{ id:"producao",label:"Produção",icon:"🏭"},{ id:"financeiro",label:"Financeiro",icon:"💰"},{ id:"contas",label:"Contas a Pagar",icon:"📋"},{ id:"compras",label:"Compras",icon:"🛒"},{ id:"premio",label:"Prêmio Gerentes",icon:"🏆"},{ id:"avaliacao",label:"Avaliação Anual",icon:"📈"},{ id:"config",label:"Configurações",icon:"⚙️"}];

const fmt = v => v!=null ? Number(v).toLocaleString("pt-BR",{style:"currency",currency:"BRL"}) : "—";
const pct = v => v!=null ? `${Number(v).toFixed(1)}%` : "—";
const sem = (v,m=30) => v<=m?"#2ECC71":v<=m+5?"#F39C12":"#E74C3C";
const hoje = () => new Date().toISOString().slice(0,10); const S = {
  app:{ fontFamily:"'DM Sans','Segoe UI',sans-serif", background:"#0F1117", minHeight:"100vh", color:"#E8E8E8", display:"flex" },
  sb:{ width:220, background:"#161922", borderRight:"1px solid #252A35", display:"flex", flexDirection:"column", padding:"24px 0", position:"fixed", top:0, left:0, bottom:0, zIndex:100 },
  logo:{ padding:"0 20px 24px", borderBottom:"1px solid #252A35", marginBottom:16 },
  nav:a=>({ display:"flex", alignItems:"center", gap:10, padding:"10px 20px", cursor:"pointer", fontSize:13, fontWeight:a?600:400, color:a?"#FF6B35":"#8090A8", background:a?"rgba(255,107,53,0.08)":"transparent", borderLeft:a?"2px solid #FF6B35":"2px solid transparent" }),
  main:{ marginLeft:220, flex:1, display:"flex", flexDirection:"column" },
  top:{ background:"#161922", borderBottom:"1px solid #252A35", padding:"14px 28px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:50 },
  cont:{ padding:28, flex:1 },
  card:{ background:"#1C2130", borderRadius:12, border:"1px solid #252A35", padding:20 },
  cT:{ fontSize:12, fontWeight:600, color:"#5A6070", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:12 },
  g:n=>({ display:"grid", gridTemplateColumns:`repeat(${n},1fr)`, gap:16 }),
  kV:{ fontSize:26, fontWeight:700, lineHeight:1 },
  kL:{ fontSize:12, color:"#5A6070", marginTop:4 },
  btn:v=>({ padding:"8px 16px", borderRadius:8, border:"none", cursor:"pointer", fontSize:13, fontWeight:600, background:v==="primary"?"#FF6B35":v==="ghost"?"transparent":"#252A35", color:v==="ghost"?"#8090A8":"#fff" }),
  inp:{ background:"#0F1117", border:"1px solid #252A35", borderRadius:8, padding:"8px 12px", color:"#E8E8E8", fontSize:13, width:"100%", outline:"none", boxSizing:"border-box" },
  sel:{ background:"#0F1117", border:"1px solid #252A35", borderRadius:8, padding:"8px 12px", color:"#E8E8E8", fontSize:13, width:"100%", outline:"none" },
  lbl:{ fontSize:12, color:"#8090A8", marginBottom:4, display:"block" },
  tbl:{ width:"100%", borderCollapse:"collapse", fontSize:13 },
  th:{ textAlign:"left", padding:"10px 12px", color:"#5A6070", fontSize:11, fontWeight:600, textTransform:"uppercase", borderBottom:"1px solid #252A35" },
  td:{ padding:"10px 12px", borderBottom:"1px solid #1A1F2B", color:"#C8D0DC" },
  badge:c=>({ display:"inline-block", padding:"3px 8px", borderRadius:4, fontSize:11, fontWeight:600, background:c+"22", color:c }),
};

function Login({ onLogin }) {
  const [email,setE]=useState(""); const [senha,setS]=useState(""); const [erro,setErr]=useState(""); const [load,setL]=useState(false);
  async function go() {
    setL(true); setErr("");
    const {data,error} = await supabase.auth.signInWithPassword({email,password:senha});
    if (error) { setErr("E-mail ou senha inválidos"); setL(false); return; }
    const {data:u} = await supabase.from("usuarios").select("*").eq("email",email).single();
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
        <div style={{marginTop:16,fontSize:11,color:"#3A4050",textAlign:"center"}}>Primeiro acesso? Peça ao administrador criar seu usuário.</div>
      </div>
    </div>
  );
}

function Dashboard({usuario}) {
  const [vendas,setV]=useState([]); const [envios,setE]=useState([]); const [contas,setC]=useState([]); const [load,setL]=useState(true); const [mes,setM]=useState(new Date().toISOString().slice(0,7));
  useEffect(()=>{
    (async()=>{
      setL(true);
      const ini=mes+"-01", fim=mes+"-31";
      const [v,e,c] = await Promise.all([
        supabase.from("vendas").select("*").gte("data",ini).lte("data",fim),
        supabase.from("envios_producao").select("*").gte("data",ini).lte("data",fim),
        supabase.from("contas_pagar").select("*").eq("status","PENDENTE"),
      ]);
      setV(v.data||[]); setE(e.data||[]); setC(c.data||[]); setL(false);
    })();
  },[mes]);
  const kpi = LOJAS.filter(l=>l.id!=="producao").map(l=>{
    const fat=vendas.filter(v=>v.loja_id===l.id).reduce((s,v)=>s+Number(v.valor),0);
    const cmvR=envios.filter(e=>e.loja_id===l.id).reduce((s,e)=>s+Number(e.valor_total||e.quantidade*e.valor_unitario),0);
    return {...l,fat,cmvR,cmv:fat>0?(cmvR/fat)*100:0};
  });
  const totFat=kpi.reduce((s,l)=>s+l.fat,0);
  const cmvM=totFat>0?(kpi.reduce((s,l)=>s+l.cmvR,0)/totFat)*100:0;
  const totPend=contas.reduce((s,c)=>s+Number(c.valor),0);
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24}}>
        <div><h2 style={{fontSize:20,fontWeight:700,margin:0}}>Dashboard — Visão Geral</h2><div style={{fontSize:13,color:"#5A6070",marginTop:4}}>Todas as lojas</div></div>
        <input style={{...S.inp,width:150}} type="month" value={mes} onChange={e=>setM(e.target.value)}/>
      </div>
      <div style={{...S.g(4),marginBottom:24}}>
        {[{l:"Faturamento Total",v:fmt(totFat),i:"📈"},{l:"CMV Médio da Rede",v:pct(cmvM),i:"🥩",c:sem(cmvM)},{l:"A Pagar (pendente)",v:fmt(totPend),i:"🔔",c:"#F39C12"},{l:"Qtd. Pendentes",v:contas.length,i:"⚠️",c:"#F39C12"}].map((k,i)=>(
          <div key={i} style={S.card}><div style={{fontSize:22,marginBottom:8}}>{k.i}</div><div style={{...S.kV,color:k.c||"#E8E8E8"}}>{k.v}</div><div style={S.kL}>{k.l}</div></div>
        ))}
      </div>
      {load?<div style={{color:"#5A6070",padding:20}}>Carregando…</div>:(
        <>
        <div style={{...S.card,marginBottom:24}}>
          <div style={S.cT}>Indicadores por Loja</div>
          {totFat===0?<div style={{color:"#5A6070",fontSize:13}}>Nenhum dado para este período ainda.</div>:(
          <table style={S.tbl}><thead><tr>{["Loja","Faturamento","CMV R$","CMV%"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
          <tbody>{kpi.map(l=><tr key={l.id}><td style={S.td}><span style={{color:l.cor,fontWeight:600}}>● {l.nome}</span></td><td style={S.td}>{fmt(l.fat)}</td><td style={S.td}>{fmt(l.cmvR)}</td><td style={S.td}><span style={{color:sem(l.cmv),fontWeight:700}}>{pct(l.cmv)}</span></td></tr>)}</tbody></table>
          )}
        </div>
        <div style={S.g(2)}>
          <div style={S.card}><div style={S.cT}>⚠️ Alertas CMV</div>{kpi.filter(l=>l.cmv>35&&l.fat>0).length===0?<div style={{color:"#2ECC71",fontSize:13}}>✅ Todas dentro da meta</div>:kpi.filter(l=>l.cmv>35).map(l=><div key={l.id} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #1A1F2B"}}><span>{l.nome}</span><span style={{color:"#E74C3C",fontWeight:700}}>{pct(l.cmv)} ▲</span></div>)}</div>
          <div style={S.card}><div style={S.cT}>🔔 Próximos Vencimentos</div>{contas.slice(0,5).map(c=><div key={c.id} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #1A1F2B"}}><div><div style={{fontSize:13}}>{c.fornecedor}</div><div style={{fontSize:11,color:"#5A6070"}}>{c.loja_id} · {c.vencimento}</div></div><span style={{color:"#F39C12",fontWeight:700}}>{fmt(Number(c.valor))}</span></div>)}{contas.length===0&&<div style={{color:"#2ECC71",fontSize:13}}>✅ Nenhum pendente</div>}</div>
        </div>
        </>
      )}
    </div>
  );
}

function Producao({usuario}) {
  const [precos,setP]=useState([]); const [envios,setE]=useState([]); const [form,setF]=useState({loja_id:"",data:hoje(),item:"",quantidade:""}); const [filtro,setFi]=useState({loja:"",data:hoje()}); const [saving,setSv]=useState(false);
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
}function Financeiro({usuario}) {
  const [aba,setA]=useState("vendas"); const [vendas,setV]=useState([]); const [desp,setD]=useState([]); const [filtro,setFi]=useState({loja:"",data:hoje()}); const [fv,setFv]=useState({loja_id:"",data:hoje(),canal:"",valor:""}); const [fd,setFd]=useState({loja_id:"",data:hoje(),categoria:"",valor:"",observacao:""}); const [sv,setSv]=useState(false);
  const ljs=usuario.perfil==="gerente_loja"?LOJAS.filter(l=>l.id===usuario.loja_id):LOJAS.filter(l=>l.id!=="producao");
  useEffect(()=>{ ldV(); ldD(); },[filtro]);
  async function ldV(){let q=supabase.from("vendas").select("*").eq("data",filtro.data).order("criado_em",{ascending:false}); if(filtro.loja)q=q.eq("loja_id",filtro.loja); const{data}=await q; setV(data||[]);}
  async function ldD(){let q=supabase.from("despesas_caixa").select("*").eq("data",filtro.data).order("criado_em",{ascending:false}); if(filtro.loja)q=q.eq("loja_id",filtro.loja); const{data}=await q; setD(data||[]);}
  async function svV(){if(!fv.loja_id||!fv.canal||!fv.valor)return; setSv(true); await supabase.from("vendas").insert({...fv,valor:Number(fv.valor),usuario_id:usuario.id}); setFv(f=>({...f,canal:"",valor:""})); ldV(); setSv(false);}
  async function svD(){if(!fd.loja_id||!fd.categoria||!fd.valor)return; setSv(true); await supabase.from("despesas_caixa").insert({...fd,valor:Number(fd.valor),usuario_id:usuario.id}); setFd(f=>({...f,categoria:"",valor:"",observacao:""})); ldD(); setSv(false);}
  const totV=vendas.reduce((s,v)=>s+Number(v.valor),0);
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
            <div><label style={S.lbl}>Valor (R$)</label><input style={S.inp} type="number" step="0.01" placeholder="0,00" value={fv.valor} onChange={e=>setFv(f=>({...f,valor:e.target.value}))}/></div>
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
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 2fr 1fr auto",gap:12,alignItems:"end",marginBottom:12}}>
            <div><label style={S.lbl}>Loja</label><select style={S.sel} value={fd.loja_id} onChange={e=>setFd(f=>({...f,loja_id:e.target.value}))}><option value="">Selecione…</option>{ljs.map(l=><option key={l.id} value={l.id}>{l.nome}</option>)}</select></div>
            <div><label style={S.lbl}>Data</label><input style={S.inp} type="date" value={fd.data} onChange={e=>setFd(f=>({...f,data:e.target.value}))}/></div>
            <div><label style={S.lbl}>Categoria</label><select style={S.sel} value={fd.categoria} onChange={e=>setFd(f=>({...f,categoria:e.target.value}))}><option value="">Selecione…</option>{CATEGORIAS.map(c=><option key={c}>{c}</option>)}</select></div>
            <div><label style={S.lbl}>Valor (R$)</label><input style={S.inp} type="number" step="0.01" placeholder="0,00" value={fd.valor} onChange={e=>setFd(f=>({...f,valor:e.target.value}))}/></div>
            <button style={S.btn("primary")} onClick={svD} disabled={sv}>+ Lançar</button>
          </div>
          <div><label style={S.lbl}>Observação</label><input style={S.inp} placeholder="opcional" value={fd.observacao} onChange={e=>setFd(f=>({...f,observacao:e.target.value}))}/></div>
        </div>
        <div style={S.card}><div style={S.cT}>Despesas do Dia</div>
          <table style={S.tbl}><thead><tr>{["Loja","Categoria","Valor","Obs."].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
          <tbody>{desp.map(d=>{const l=LOJAS.find(x=>x.id===d.loja_id); return<tr key={d.id}><td style={{...S.td,color:l?.cor}}>{l?.nome}</td><td style={S.td}>{d.categoria}</td><td style={{...S.td,fontWeight:600}}>{fmt(Number(d.valor))}</td><td style={{...S.td,color:"#5A6070"}}>{d.observacao||"—"}</td></tr>;})} {desp.length===0&&<tr><td colSpan={4} style={{...S.td,color:"#5A6070",textAlign:"center"}}>Nenhum lançamento</td></tr>}</tbody>
          </table>
        </div>
      </>}
    </div>
  );
}

function Contas({usuario}) {
  const [contas,setC]=useState([]); const [load,setL]=useState(true); const [show,setShow]=useState(false); const [pagId,setPId]=useState(null); const [fSt,setFSt]=useState(""); const [fLj,setFLj]=useState(""); const [sv,setSv]=useState(false); const [arq,setArq]=useState(null);
  const [form,setForm]=useState({fornecedor:"",loja_id:"",grupo:"",tipo:"",valor:"",vencimento:"",forma_pagamento:"PIX EM CONTA",numero_nf:""});
  const [fp,setFp]=useState({data_pagamento:hoje(),banco:"BANCO STONE"});
  useEffect(()=>{ carregar(); },[fSt,fLj]);
  async function carregar(){setL(true); let q=supabase.from("contas_pagar").select("*").order("vencimento",{ascending:true}); if(fSt)q=q.eq("status",fSt); if(fLj)q=q.ilike("loja_id",`%${fLj}%`); const{data}=await q; setC(data||[]); setL(false);}
  async function salvarNova(){if(!form.fornecedor||!form.valor)return; setSv(true); await supabase.from("contas_pagar").insert({...form,valor:Number(form.valor),status:"PENDENTE"}); setForm({fornecedor:"",loja_id:"",grupo:"",tipo:"",valor:"",vencimento:"",forma_pagamento:"PIX EM CONTA",numero_nf:""}); setShow(false); carregar(); setSv(false);}
  async function pagar(id){setSv(true); let url=null; if(arq){const ext=arq.name.split(".").pop(); const path=`comprovantes/${id}.${ext}`; await supabase.storage.from("documentos").upload(path,arq,{upsert:true}); const{data:pub}=supabase.storage.from("documentos").getPublicUrl(path); url=pub.publicUrl;} await supabase.from("contas_pagar").update({status:"PAGO",data_pagamento:fp.data_pagamento,banco:fp.banco,...(url&&{comprovante_url:url})}).eq("id",id); setPId(null); setArq(null); carregar(); setSv(false);}
  const pend=contas.filter(c=>c.status==="PENDENTE"); const pagos=contas.filter(c=>c.status==="PAGO");
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
        <div><h2 style={{fontSize:20,fontWeight:700,margin:0}}>Contas a Pagar</h2><div style={{fontSize:13,color:"#5A6070",marginTop:4}}>Organograma de Pagamentos</div></div>
        {(usuario.perfil==="admin"||usuario.perfil==="financeiro")&&<button style={S.btn("primary")} onClick={()=>setShow(!show)}>+ Nova Conta</button>}
      </div>
      <div style={{...S.g(3),marginBottom:24}}>
        <div style={S.card}><div style={S.cT}>Pendente</div><div style={{...S.kV,color:"#F39C12"}}>{fmt(pend.reduce((s,c)=>s+Number(c.valor),0))}</div><div style={S.kL}>{pend.length} registros</div></div>
        <div style={S.card}><div style={S.cT}>Pago</div><div style={{...S.kV,color:"#2ECC71"}}>{fmt(pagos.reduce((s,c)=>s+Number(c.valor),0))}</div><div style={S.kL}>{pagos.length} registros</div></div>
        <div style={S.card}><div style={S.cT}>Total</div><div style={S.kV}>{fmt(contas.reduce((s,c)=>s+Number(c.valor),0))}</div><div style={S.kL}>{contas.length} registros</div></div>
      </div>
      {show&&<div style={{...S.card,marginBottom:24,borderColor:"#FF6B35"}}><div style={S.cT}>Nova Conta</div><div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr",gap:12,marginBottom:12}}><div><label style={S.lbl}>Fornecedor</label><input style={S.inp} value={form.fornecedor} onChange={e=>setForm(f=>({...f,fornecedor:e.target.value}))}/></div><div><label style={S.lbl}>Loja</label><select style={S.sel} value={form.loja_id} onChange={e=>setForm(f=>({...f,loja_id:e.target.value}))}><option value="">Selecione…</option>{[...LOJAS,{id:"administrativo",nome:"ADMINISTRATIVO"}].map(l=><option key={l.id} value={l.id}>{l.nome}</option>)}</select></div><div><label style={S.lbl}>Grupo</label><select style={S.sel} value={form.grupo} onChange={e=>setForm(f=>({...f,grupo:e.target.value}))}><option value="">Selecione…</option>{GRUPOS.map(g=><option key={g}>{g}</option>)}</select></div><div><label style={S.lbl}>Valor (R$)</label><input style={S.inp} type="number" value={form.valor} onChange={e=>setForm(f=>({...f,valor:e.target.value}))}/></div><div><label style={S.lbl}>Vencimento</label><input style={S.inp} type="date" value={form.vencimento} onChange={e=>setForm(f=>({...f,vencimento:e.target.value}))}/></div></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr auto",gap:12,alignItems:"end"}}><div><label style={S.lbl}>Tipo</label><input style={S.inp} value={form.tipo} onChange={e=>setForm(f=>({...f,tipo:e.target.value}))}/></div><div><label style={S.lbl}>Nº NF</label><input style={S.inp} value={form.numero_nf} onChange={e=>setForm(f=>({...f,numero_nf:e.target.value}))}/></div><button style={S.btn("primary")} onClick={salvarNova} disabled={sv}>Salvar</button></div></div>}
      {pagId&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:300}}><div style={{...S.card,width:420,borderColor:"#2ECC71"}}><div style={{fontSize:16,fontWeight:700,marginBottom:16}}>✅ Confirmar Pagamento</div><div style={{marginBottom:12}}><label style={S.lbl}>Data</label><input style={S.inp} type="date" value={fp.data_pagamento} onChange={e=>setFp(f=>({...f,data_pagamento:e.target.value}))}/></div><div style={{marginBottom:12}}><label style={S.lbl}>Banco</label><select style={S.sel} value={fp.banco} onChange={e=>setFp(f=>({...f,banco:e.target.value}))}>{["BANCO STONE","BANCO IFOOD","BANCO DO BRASIL","CAIXA","ITAÚ","BRADESCO","SICOOB"].map(b=><option key={b}>{b}</option>)}</select></div><div style={{marginBottom:16}}><label style={S.lbl}>📎 Comprovante</label><input style={{...S.inp,cursor:"pointer"}} type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={e=>setArq(e.target.files[0])}/></div><div style={{display:"flex",gap:8}}><button style={{...S.btn("primary"),flex:1}} onClick={()=>pagar(pagId)} disabled={sv}>{sv?"Salvando…":"Confirmar Pago"}</button><button style={{...S.btn("secondary"),flex:1}} onClick={()=>setPId(null)}>Cancelar</button></div></div></div>}
      <div style={S.card}><div style={{display:"flex",gap:8,marginBottom:16}}><select style={{...S.sel,width:160}} value={fSt} onChange={e=>setFSt(e.target.value)}><option value="">Todos</option><option value="PENDENTE">Pendente</option><option value="PAGO">Pago</option></select><input style={{...S.inp,width:200}} placeholder="Filtrar por loja…" value={fLj} onChange={e=>setFLj(e.target.value)}/></div>
      {load?<div style={{color:"#5A6070"}}>Carregando…</div>:<table style={S.tbl}><thead><tr>{["Fornecedor","Loja","Tipo","Valor","Vencimento","Status","Ação"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead><tbody>{contas.map(c=><tr key={c.id}><td style={{...S.td,fontWeight:600}}>{c.fornecedor}</td><td style={S.td}>{c.loja_id}</td><td style={S.td}>{c.tipo}</td><td style={{...S.td,fontWeight:700}}>{fmt(Number(c.valor))}</td><td style={S.td}>{c.vencimento}</td><td style={S.td}><span style={S.badge(c.status==="PAGO"?"#2ECC71":"#F39C12")}>{c.status}</span></td><td style={S.td}>{c.status==="PENDENTE"&&usuario.perfil==="admin"&&<button style={{...S.btn("primary"),padding:"4px 10px",fontSize:12}} onClick={()=>setPId(c.id)}>Pagar</button>}{c.status==="PAGO"&&<span style={{fontSize:11,color:"#2ECC71"}}>✓ {c.data_pagamento}</span>}{c.comprovante_url&&<a href={c.comprovante_url} target="_blank" rel="noreferrer" style={{fontSize:11,color:"#3A8FE8",marginLeft:8}}>📎</a>}</td></tr>)}{contas.length===0&&<tr><td colSpan={7} style={{...S.td,color:"#5A6070",textAlign:"center"}}>Nenhum registro</td></tr>}</tbody></table>}</div>
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
  const render=()=>{ switch(pagina){case"dashboard":return<Dashboard usuario={usuario}/>; case"producao":return<Producao usuario={usuario}/>; case"financeiro":return<Financeiro usuario={usuario}/>; case"contas":return<Contas usuario={usuario}/>; case"config":return<Config usuario={usuario}/>; default:return<div style={{...S.card,color:"#5A6070",marginTop:20}}>Módulo em desenvolvimento.</div>;} };
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
