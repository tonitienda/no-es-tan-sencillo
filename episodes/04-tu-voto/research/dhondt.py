# Simulaciones C1 y C2 del episodio 04. Datos inventados, no son resultados reales.
# Uso: python3 dhondt.py
def dhondt(votes, seats, blank=0, thr=0.03):
    valid = sum(votes.values()) + blank
    elig = {p:v for p,v in votes.items() if v >= thr*valid}
    q = sorted(((v/d, p, d) for p,v in elig.items() for d in range(1,seats+1)), reverse=True)
    res = {p:0 for p in votes}
    for x in q[:seats]: res[x[1]] += 1
    return res, valid, q[seats-1], q[seats]
print("== pequeña, 5 escaños")
small = dict(A=70000,B=60000,C=34000,D=26000,E=6000)
for blank in (4000, 40000):
  r,valid,last,nxt = dhondt(small,5,blank); print(blank, r, valid, 'last',last,'next',nxt)
# switch: 4,001 voters from E to D
s2=dict(small); s2['D']+=4001; s2['E']-=4001
print('D+4001', dhondt(s2,5,4000)[0])
s3=dict(small); s3['D']+=4001
print('D+4001 nuevos votantes', dhondt(s3,5,4000)[0])
print("== grande, 37 escaños")
big = dict(A=1150000,B=950000,C=520000,D=480000,F=106000,G=60000)
for blank in (234000, 269000):
  r,valid,last,nxt = dhondt(big,37,blank); print(blank, r, valid, 'thr',0.03*valid, 'last',last,'next',nxt)
