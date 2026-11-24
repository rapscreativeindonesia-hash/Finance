'use strict';
/*
 * Finance PDF Report — pure local browser generation, no CDN, server, or upload.
 * A4 portrait, vector art, selectable text, automatic transaction pagination.
 */
(function(){
  const W=595.28,H=841.89;
  const C={dark:'#091E17',forest:'#123A2A',green:'#58B66B',lime:'#A8E487',ink:'#183127',muted:'#647A70',light:'#F5F8F5',white:'#FFFFFF',line:'#DCE8DF',pale:'#E7F4E9',red:'#C65B64',redBg:'#FCEDEE'};
  const fmt=n=>'Rp '+Math.round(Number(n)||0).toLocaleString('id-ID');
  const num=n=>Number(n)||0;
  const ascii=v=>String(v??'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[\u2010-\u2015]/g,'-').replace(/[\u2018\u2019]/g,"'").replace(/[\u201c\u201d]/g,'"').replace(/\u2026/g,'...').replace(/[^\x20-\x7E]/g,'?');
  const esc=v=>ascii(v).replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)');
  const rgb=h=>{const s=h.replace('#','');return [0,2,4].map(i=>(parseInt(s.slice(i,i+2),16)/255).toFixed(3)).join(' ');};
  const p=n=>Number(n.toFixed(2));
  const textWidth=(str,size,bold)=>{let factor=0;for(const c of ascii(str)){if('ilI.,:;!| '.includes(c))factor+=.26;else if('MW@'.includes(c))factor+=.85;else if('frt'.includes(c))factor+=.36;else if('0123456789'.includes(c))factor+=.56;else factor+=.55;}return factor*size*(bold?1.045:1);};
  const fit=(txt,sz,max,bold)=>{let s=ascii(txt);if(textWidth(s,sz,bold)<=max)return s;while(s.length&&textWidth(s+'...',sz,bold)>max)s=s.slice(0,-1);return s+'...';};
  const monthLabel=k=>{const a=String(k).split('-').map(Number);if(a.length<2||a[1]<1||a[1]>12)return ascii(k);return ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'][a[1]-1]+' '+a[0];};
  const stamp=()=>{const d=new Date();return d.toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'});};
  const localDate=s=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(s||''))return ascii(s);const [y,m,d]=s.split('-');return d+'/'+m+'/'+y;};
  class Page{
    constructor(){this.cmd=[];}
    add(s){this.cmd.push(s);return this;}
    fill(col){this.add(rgb(col)+' rg');return this;}
    stroke(col){this.add(rgb(col)+' RG');return this;}
    rect(x,y,w,h,col){this.fill(col).add(p(x)+' '+p(H-y-h)+' '+p(w)+' '+p(h)+' re f');return this;}
    round(x,y,w,h,r,col,edge){
      const x0=x,y0=H-y-h,k=.55228475,r0=Math.min(r,w/2,h/2);
      const cmd=[
        p(x0+r0)+' '+p(y0)+' m',
        p(x0+w-r0)+' '+p(y0)+' l',
        p(x0+w-r0+k*r0)+' '+p(y0)+' '+p(x0+w)+' '+p(y0+r0-k*r0)+' '+p(x0+w)+' '+p(y0+r0)+' c',
        p(x0+w)+' '+p(y0+h-r0)+' l',
        p(x0+w)+' '+p(y0+h-r0+k*r0)+' '+p(x0+w-r0+k*r0)+' '+p(y0+h)+' '+p(x0+w-r0)+' '+p(y0+h)+' c',
        p(x0+r0)+' '+p(y0+h)+' l',
        p(x0+r0-k*r0)+' '+p(y0+h)+' '+p(x0)+' '+p(y0+h-r0+k*r0)+' '+p(x0)+' '+p(y0+h-r0)+' c',
        p(x0)+' '+p(y0+r0)+' l',
        p(x0)+' '+p(y0+r0-k*r0)+' '+p(x0+r0-k*r0)+' '+p(y0)+' '+p(x0+r0)+' '+p(y0)+' c','h'
      ];
      this.fill(col);if(edge)this.stroke(edge);this.add(cmd.join('\n')+'\n'+(edge?'B':'f'));return this;
    }
    line(x,y,x2,y2,col,width=1){this.stroke(col).add(p(width)+' w '+p(x)+' '+p(H-y)+' m '+p(x2)+' '+p(H-y2)+' l S');return this;}
    text(x,y,s,size=10,color=C.ink,bold=false,align='left',max=1000){
      const value=fit(s,size,max,bold);
      if(align==='right')x-=textWidth(value,size,bold);
      else if(align==='center')x-=textWidth(value,size,bold)/2;
      this.fill(color).add('BT /'+(bold?'F2':'F1')+' '+p(size)+' Tf '+p(x)+' '+p(H-y)+' Td ('+esc(value)+') Tj ET');return this;
    }
  }
  function logo(pg,x,y){
    pg.round(x,y,33,33,8,C.lime);
    pg.round(x+8,y+17,4,10,1,C.forest);
    pg.round(x+15,y+11,4,16,1,C.forest);
    pg.round(x+22,y+6,4,21,1,C.forest);
  }
  function headline(pg,title,subtitle,period,short){
    pg.rect(0,0,W,short?112:181,C.dark);
    pg.round(408,short?0:16,162,short?98:153,34,C.forest);
    pg.rect(0,short?107:177,W,short?5:4,C.green);
    logo(pg,40,24);
    pg.text(84,40,'FINANCE',17,C.white,true);
    pg.text(85,56,'KEUANGAN PRIBADI',7.5,C.lime,false);
    if(short){
      pg.text(40,89,title,19,C.white,true);
      pg.text(555,88,period,9,C.lime,false,'right');
    }else{
      pg.text(40,108,title,24,C.white,true);
      pg.text(40,135,subtitle,10,'#C9DBCF');
      pg.text(40,157,period,10,C.lime,true);
      pg.text(555,157,'Dibuat '+stamp(),8,'#C9DBCF',false,'right');
    }
  }
  function footer(pg,index,total){
    pg.line(40,803,555,803,C.line,.8);
    pg.text(40,820,'FINANCE  /  LAPORAN PRIBADI',8,C.muted,true);
    pg.text(555,820,'Halaman '+index+' / '+total,8,C.muted,false,'right');
  }
  function summaryCard(pg,x,y,w,title,amount,type){
    const fill=type==='green'?'#ECF7EC':type==='red'?'#FFF0F0':'#E5F2EA';
    pg.round(x,y,w,91,12,fill);
    pg.text(x+16,y+26,title.toUpperCase(),8,C.muted,true);
    pg.text(x+16,y+57,fit(fmt(amount),17,w-28,true),17,type==='red'?C.red:C.forest,true);
    const line=type==='red'?C.red:C.green;
    pg.round(x+16,y+71,Math.min(40,w-32),3,1.5,line);
  }
  function plot(pg,series){
    pg.round(40,321,515,224,13,C.white,C.line);
    pg.text(59,350,'TREN ARUS KAS',11,C.ink,true);
    pg.text(59,369,'Perbandingan pemasukan dan pengeluaran 6 bulan',8,C.muted);
    pg.round(394,341,9,9,2,C.green);
    pg.text(409,350,'Masuk',8,C.muted);
    pg.round(471,341,9,9,2,C.red);
    pg.text(486,350,'Keluar',8,C.muted);
    const baseline=503,top=395,height=106,max=Math.max(1,...series.flatMap(x=>[x.income,x.expense]));
    for(let i=0;i<=3;i++){
      const yy=baseline-(height*i/3);
      pg.line(59,yy,534,yy,'#E7EFEB',.65);
    }
    const slot=475/series.length;
    for(let i=0;i<series.length;i++){
      const s=series[i],cx=59+slot*(i+.5),scale=height/max;
      const h1=Math.max(1.6,s.income*scale),h2=Math.max(1.6,s.expense*scale);
      pg.round(cx-15,baseline-h1,12,h1,2.5,C.green);
      pg.round(cx+1,baseline-h2,12,h2,2.5,C.red);
      pg.text(cx,522,s.name,8,C.muted,false,'center');
    }
  }
  function categories(pg,cats,total){
    pg.round(40,563,515,226,13,C.white,C.line);
    pg.text(59,591,'PENGELUARAN PER KATEGORI',11,C.ink,true);
    pg.text(59,607,'Proporsi pengeluaran pada periode terpilih',8,C.muted);
    if(!cats.length){
      pg.text(297,683,'Belum ada transaksi pengeluaran.',11,C.muted,false,'center');
      pg.text(297,703,'Tambahkan pengeluaran untuk menampilkan analisis.',8,C.muted,false,'center');
      return;
    }
    const sorted=cats.slice().sort((a,b)=>b.amount-a.amount);
    const display=sorted.slice(0,6);
    display.forEach((c,i)=>{
      const y=635+i*23,pct=total>0?c.amount/total:0;
      pg.text(59,y,fit(c.name,9,127),9,C.ink,true);
      pg.round(188,y-8,205,6,3,'#E7EFE8');
      pg.round(188,y-8,Math.max(2,205*pct),6,3,C.green);
      pg.text(535,y,fmt(c.amount),9,C.ink,true,'right',128);
    });
    if(sorted.length>6)pg.text(59,780,'+'+(sorted.length-6)+' kategori lainnya tidak ditampilkan.',8,C.muted);
  }
  function summary(data,series,cats){
    const pg=new Page();
    pg.rect(0,0,W,H,C.light);
    headline(pg,'LAPORAN KEUANGAN','Ringkasan, tren, dan rincian transaksi',monthLabel(data.period),false);
    pg.text(40,206,'RINGKASAN BULANAN',10,C.muted,true);
    const i=total(data.transactions,'income'),o=total(data.transactions,'expense');
    summaryCard(pg,40,220,163,'Pemasukan',i,'green');
    summaryCard(pg,216,220,163,'Pengeluaran',o,'red');
    summaryCard(pg,392,220,163,'Arus kas bersih',i-o,'main');
    plot(pg,series);
    categories(pg,cats,o);
    return pg;
  }
  function total(rows,type){return rows.filter(x=>x.type===type).reduce((sum,x)=>sum+num(x.amount),0);}
  function transactionPage(data,rows,start,end,idx){
    const pg=new Page();
    pg.rect(0,0,W,H,C.light);
    headline(pg,'RINCIAN TRANSAKSI','',monthLabel(data.period),true);
    pg.round(40,134,515,53,12,C.pale);
    pg.text(57,156,'TRANSAKSI DICATAT',8,C.muted,true);
    pg.text(57,175,String(data.transactions.length)+' transaksi selama '+monthLabel(data.period),10,C.ink,true);
    pg.text(537,164,'Bagian '+idx,9,C.forest,true,'right');
    pg.round(40,206,515,32,6,C.forest);
    pg.text(52,226,'TANGGAL',7.7,C.white,true);
    pg.text(117,226,'JENIS',7.7,C.white,true);
    pg.text(197,226,'KATEGORI',7.7,C.white,true);
    pg.text(305,226,'KETERANGAN',7.7,C.white,true);
    pg.text(543,226,'NOMINAL',7.7,C.white,true,'right');
    const rowHeight=25.2,origin=245;
    rows.forEach((t,i)=>{
      const y=origin+i*rowHeight;
      pg.round(40,y-2,515,rowHeight-1,1,i%2===0?C.white:'#EFF5F0');
      const up=t.type==='income';
      pg.text(52,y+14,localDate(t.date),8,C.ink);
      pg.text(117,y+14,up?'Masuk':'Keluar',8,up?C.forest:C.red,true);
      pg.text(197,y+14,t.category||'-',8,C.ink,false,'left',100);
      pg.text(305,y+14,t.title||'-',8,C.ink,false,'left',127);
      pg.text(543,y+14,(up?'+ ':'- ')+fmt(t.amount),8,up?C.forest:C.red,true,'right',102);
    });
    const bot=origin+rows.length*rowHeight+16;
    pg.line(40,Math.min(bot,772),555,Math.min(bot,772),C.line,.8);
    const sin=total(rows,'income'),sout=total(rows,'expense');
    pg.text(45,781,'Pemasukan halaman ini: '+fmt(sin),7.8,C.forest,true);
    pg.text(550,781,'Pengeluaran: '+fmt(sout),7.8,C.red,true,'right');
    return pg;
  }
  class Document{
    constructor(){this.pages=[];}
    add(page){this.pages.push(page);return this;}
    build(){
      const objects=[null,'<< /Type /Catalog /Pages 2 0 R >>',null,
        '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
        '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>'];
      const kids=[];
      this.pages.forEach((pg,i)=>{
        footer(pg,i+1,this.pages.length);
        const id=5+i*2,cid=id+1;
        kids.push(id+' 0 R');
        const stream=pg.cmd.join('\n')+'\n';
        objects[id]='<< /Type /Page /Parent 2 0 R /MediaBox [0 0 '+W+' '+H+'] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents '+cid+' 0 R >>';
        objects[cid]='<< /Length '+stream.length+' >>\nstream\n'+stream+'endstream';
      });
      objects[2]='<< /Type /Pages /Kids ['+kids.join(' ')+'] /Count '+this.pages.length+' >>';
      let out='%PDF-1.4\n%\xE2\xE3\xCF\xD3\n', offsets=[0];
      for(let i=1;i<objects.length;i++){
        offsets[i]=out.length;
        out+=i+' 0 obj\n'+objects[i]+'\nendobj\n';
      }
      const xref=out.length;
      out+='xref\n0 '+objects.length+'\n0000000000 65535 f \n';
      for(let i=1;i<objects.length;i++)out+=String(offsets[i]).padStart(10,'0')+' 00000 n \n';
      out+='trailer\n<< /Size '+objects.length+' /Root 1 0 R >>\nstartxref\n'+xref+'\n%%EOF';
      return Uint8Array.from(out,c=>c.charCodeAt(0)&255);
    }
  }
  function create(data){
    const all=Array.isArray(data.transactions)?data.transactions:[];
    const rows=all.filter(x=>String(x.date).startsWith(data.period)&&['income','expense'].includes(x.type))
      .sort((a,b)=>String(a.date).localeCompare(String(b.date))||String(a.title).localeCompare(String(b.title)));
    const byMonth=[];
    const [y,m]=data.period.split('-').map(Number);
    for(let k=5;k>=0;k--){
      const d=new Date(y,m-1-k,1),key=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');
      const monthly=all.filter(x=>String(x.date).startsWith(key));
      byMonth.push({name:['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'][d.getMonth()],income:total(monthly,'income'),expense:total(monthly,'expense')});
    }
    const agg={};rows.filter(x=>x.type==='expense').forEach(x=>{const k=String(x.category||'Lainnya');agg[k]=(agg[k]||0)+num(x.amount);});
    const cats=Object.keys(agg).map(name=>({name,amount:agg[name]}));
    const doc=new Document().add(summary({period:data.period,transactions:rows},byMonth,cats));
    const batch=21;
    for(let offset=0;offset<rows.length;offset+=batch){
      doc.add(transactionPage({period:data.period,transactions:rows},rows.slice(offset,offset+batch),offset,offset+batch,1+Math.floor(offset/batch)));
    }
    return doc.build();
  }
  function download(data){
    if(!data||!/^\d{4}-(0[1-9]|1[0-2])$/.test(data.period))throw new Error('Periode tidak valid');
    const pdf=create(data);
    const blob=new Blob([pdf],{type:'application/pdf'}),url=URL.createObjectURL(blob);
    const a=document.createElement('a');a.href=url;a.download='Finance-Laporan-Keuangan-'+data.period+'.pdf';
    document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),45000);
    return {pages:Math.max(1,Math.ceil((data.transactions||[]).filter(t=>String(t.date).startsWith(data.period)).length/21)+1),bytes:pdf.length};
  }
  window.FinanceReportPDF={create,download};
})();