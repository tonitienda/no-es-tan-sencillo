# D4: votos a listas sin escaño en su provincia, generales 2023.
# Entrada: texto de BOE-A-2023-18907 (pdftotext -layout) en boe/jec2023.txt. Uso: python3 votos-sin-escano-2023.py
import re,collections
L=open('boe/jec2023.txt').read().split('\n')
s=[i for i,l in enumerate(L) if re.match(r'\s*CUADRO II\s*$',l)][0]
e=[i for i,l in enumerate(L) if re.match(r'\s*CUADRO III\s*$',l)][0]
num=r'\d{1,3}(?:\.\d{3})*'
seatvotes=collections.Counter(); seats=collections.Counter(); totals={}
pend=None
for l in L[s:e]:
    if 'Total estatal' in l or 'BOLET' in l or 'Verificable' in l or 'cve:' in l or 'Núm.' in l: continue
    m=re.match(r'\s{2,}([A-ZÁÉÍÓÚ][^\d]*?)\s{2,}('+num+r'.*)$',l)
    nums=None
    if m and re.search(r'\d',m.group(2)):
        name=m.group(1).strip(); nums=re.findall(num,m.group(2))
    else:
        m2=re.match(r'\s{2,}([A-ZÁÉÍÓÚ][^\d]*)$',l)
        if m2 and l.strip(): pend=(pend or '')+m2.group(1).strip(); continue
        m3=re.match(r'\s{10,}('+num+r'(\s+'+num+r')+)\s*$',l)
        if m3: name='(cont)'; nums=re.findall(num,m3.group(1))
        else: continue
    if name=='(cont)' or name.endswith('/'): name=(pend or name); 
    pend=None
    vals=[int(x.replace('.','')) for x in nums]
    tot=vals[0]; rest=vals[1:]
    key=name.rstrip('.')[:6].lower()
    totals[key]=tot
    for v,sv in zip(rest[0::2],rest[1::2]):
        if sv>0: seatvotes[key]+=v; seats[key]+=sv
print('circunscripciones',len(totals),'escaños',sum(seats.values()))
bad={k:(seats[k],totals[k]) for k in totals if seats[k]!=totals[k]}
print('mismatch',bad)
# cuadro I: votos a candidaturas por provincia
c1={}
for l in L[60:140]:
    m=re.match(r'\s{2,}([A-ZÁÉÍÓÚ][^\d]*?)\s{2,}('+num+r')\s+('+num+r')\s+('+num+r')\s+('+num+r')\s+('+num+r')\s+('+num+r')\s*$',l)
    if m: c1[m.group(1).strip().rstrip('.')[:6].lower()]=[int(m.group(i).replace('.','')) for i in range(2,8)]
c1={k:v for k,v in c1.items() if not k.startswith('total')}
tc=sum(v[3] for v in c1.values()); ts=sum(seatvotes[k] for k in c1); tv=sum(v[2] for v in c1.values())
print('provincias',len(c1),'válidos',tv,'a candidaturas',tc,'a listas con escaño',ts,'sin escaño',tc-ts, round(100*(tc-ts)/tv,2))
rows=sorted(((100*(c1[k][3]-seatvotes[k])/c1[k][2],k) for k in c1),reverse=True)
print(rows[:4], rows[-4:])
