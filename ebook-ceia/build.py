# Gera o HTML da "Ceia de Natal Econômica — Edição Completa".
# Uso: python3 build.py  -> escreve ceia-natal-economica-v2.html ao lado deste arquivo.
import html, os

E = html.escape
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "ceia-natal-economica-v2.html")

# ---------------------------------------------------------------- componentes
def tok(i):
    # marcador invisível usado só para descobrir em que página cada item caiu (sumário)
    return f'<span class="tok">@@{i}@@</span>'

def chapter(cid, kick, title, lead, body):
    return f'''<section class="chap" id="{cid}">{tok(cid)}
<p class="kick">{kick}</p><h2>{title}</h2><div class="rule"></div>
<p class="lead">{lead}</p>
{body}
</section>'''

def part(pid, num, title, sub, items):
    lis = "".join(f"<li>{x}</li>" for x in items)
    return f'''<section class="part" id="{pid}">{tok(pid)}
<p class="orn">✦ ✦ ✦</p><p class="pnum">Parte {num}</p><h2>{title}</h2><div class="rule c"></div>
<p class="psub">{sub}</p><ul class="pitems">{lis}</ul></section>'''

def tip(kind, title, text):
    return f'<div class="box {kind}"><b>{title}</b> {text}</div>'

def recipe(r):
    chips = "".join(f"<span>{c}</span>" for c in r["chips"])
    ing = ""
    for grp, items in r["ing"]:
        if grp:
            ing += f'<p class="sub">{grp}</p>'
        ing += "<ul>" + "".join(f"<li>{x}</li>" for x in items) + "</ul>"
    steps = "<ol>" + "".join(f"<li>{x}</li>" for x in r["steps"]) + "</ol>"
    extra = ""
    facts = []
    if r.get("ahead"):
        facts.append(("Dá para adiantar?", r["ahead"]))
    if r.get("keep"):
        facts.append(("Como guardar", r["keep"]))
    if r.get("swap"):
        facts.append(("Troque e economize", r["swap"]))
    if r.get("err"):
        facts.append(("Erro comum", r["err"]))
    if facts:
        extra = '<div class="facts">' + "".join(f'<div><p class="fh">{a}</p><p>{b}</p></div>' for a, b in facts) + "</div>"
    tips = "".join(tip(*t) for t in r.get("tips", []))
    intro = f'<p class="rintro">{r["intro"]}</p>' if r.get("intro") else ""
    return f'''<article class="recipe" id="{r["id"]}">{tok(r["id"])}
<p class="rcat">{r["cat"]}</p><h3>{r["title"]}</h3>{intro}
<div class="chips">{chips}</div>
<div class="rgrid"><div class="ing"><p class="h4">Ingredientes</p>{ing}</div>
<div class="steps"><p class="h4">Modo de preparo</p>{steps}</div></div>
{tips}{extra}</article>'''

def table(head, rows, cls=""):
    th = "".join(f"<th>{h}</th>" for h in head)
    trs = "".join("<tr>" + "".join(f"<td>{c}</td>" for c in r) + "</tr>" for r in rows)
    return f'<table class="t {cls}"><thead><tr>{th}</tr></thead><tbody>{trs}</tbody></table>'

def R(v):
    return "R$ " + f"{v:,.0f}".replace(",", ".")

# ---------------------------------------------------------------- receitas
REC = {}
def add(**r):
    REC[r["id"]] = r

add(id="r-pernil", cat="Prato principal", title="Pernil com laranja e alho",
    intro="A estrela econômica da ceia. Com tempero de véspera e forno paciente, fica macio, suculento e com a pele crocante.",
    chips=["10 porções", "Preparo: 20 min", "Marinada: 12 h", "Forno: ~3h30", "Custo: ~R$ 70"],
    ing=[(None, ["3,5 kg de pernil suíno com osso e pele", "6 dentes de alho amassados", "Suco de 4 laranjas", "1 cebola ralada",
                 "3 colheres (sopa) de óleo", "2 colheres (sopa) de sal", "1 colher (chá) de pimenta-do-reino", "3 folhas de louro"]),
         ("Para o molho", ["Todo o caldo da assadeira", "1 colher (sopa) de amido de milho", "3 colheres (sopa) de água fria"])],
    steps=["Na <b>noite anterior</b>, faça cortes em xadrez na pele e fure a carne com uma faca pontuda.",
           "Misture alho, suco de laranja, cebola, óleo, sal, pimenta e louro. Cubra o pernil com essa marinada, tampe e leve à geladeira por pelo menos 12 horas, virando uma vez.",
           "Retire da geladeira 1 hora antes de assar. Preaqueça o forno a 180 °C.",
           "Coloque o pernil em assadeira funda com a marinada, cubra com papel-alumínio (lado brilhante para dentro) e asse por cerca de 3 horas, regando com o caldo a cada 40 minutos.",
           "Retire o papel, aumente para 220 °C e asse por mais 20 a 30 minutos, até a pele dourar e ficar crocante.",
           "Está pronto quando a faca entra sem esforço e a carne se solta do osso. Com termômetro, o centro deve passar de <b>70 °C</b>. Deixe descansar 30 minutos antes de fatiar.",
           "Molho: coe o caldo da assadeira, retire o excesso de gordura com uma colher, leve ao fogo e junte o amido dissolvido na água fria. Mexa até engrossar."],
    tips=[("tip", "Por que descansar?", "Os sucos se redistribuem pela carne. Fatiado quente demais, tudo escorre e a fatia fica seca."),
          ("tip", "Fatie contra as fibras.", "Fatias finas e no sentido contrário às fibras rendem mais e parecem mais macias.")],
    ahead="Sim. Pode assar no dia 23, esfriar, fatiar e guardar com o molho. No dia 24, reaqueça coberto a 180 °C por cerca de 40 minutos, até ficar bem quente por inteiro.",
    keep="Geladeira: 3 a 4 dias. Congelado em porções: até 3 meses.",
    swap="Sem laranja? Use suco de 3 limões + ½ copo de água. Sem louro, use alecrim ou orégano.",
    err="Assar direto em forno alto: a pele queima antes de o centro cozinhar. Primeiro coberto e baixo, depois descoberto e alto.")

add(id="r-pressao", cat="Prato principal · sem forno", title="Pernil na panela de pressão",
    intro="Para quem não tem forno, tem forno pequeno ou quer liberar o forno para outros pratos. Fica macio e desfia fácil.",
    chips=["10 porções", "Preparo: 20 min", "Marinada: 12 h", "Pressão: ~50 min", "Custo: ~R$ 70"],
    ing=[(None, ["3,5 kg de pernil (peça ao açougueiro para cortar em 4 ou 5 pedaços grandes)", "A mesma marinada do pernil assado (alho, laranja, cebola, óleo, sal, pimenta e louro)",
                 "1 xícara (chá) de água", "1 colher (sopa) de amido de milho (para o molho)"])],
    steps=["Tempere os pedaços na véspera, como no pernil assado, e deixe na geladeira por pelo menos 12 horas.",
           "Doure os pedaços aos poucos na própria panela de pressão, com um fio de óleo, sem tampar.",
           "Junte a marinada e a água. <b>Não passe de 2/3 da capacidade da panela</b>: se não couber, cozinhe em duas levas.",
           "Tampe e cozinhe por 45 a 50 minutos depois que pegar pressão, em fogo médio-baixo.",
           "Desligue e espere a pressão sair sozinha antes de abrir.",
           "Para a casca dourada: leve os pedaços à airfryer (200 °C, 10 a 12 min) ou a uma frigideira larga bem quente.",
           "Engrosse o caldo com o amido dissolvido em um pouco de água fria e use como molho."],
    tips=[("alert", "Segurança da panela de pressão:", "confira a borracha e a válvula antes de usar, nunca force a tampa e nunca encha além de 2/3.")],
    ahead="Sim. Cozinhe no dia 23 e só doure no dia 24.",
    keep="Igual ao pernil assado: 3 a 4 dias na geladeira, 3 meses no congelador.",
    swap="Sobrou caldo? Ele vira a base do arroz ou da sopa do dia 25.")

add(id="r-frango", cat="Prato principal · plano B", title="Coxa e sobrecoxa douradas com batatas",
    intro="Não gosta de carne de porco ou quer gastar ainda menos? Barato, saboroso e faz sucesso com todas as idades.",
    chips=["10 porções", "Preparo: 20 min", "Marinada: 2 h", "Forno: ~1 h", "Custo: ~R$ 57"],
    ing=[(None, ["4 kg de coxas e sobrecoxas de frango", "1,5 kg de batatas em cubos grandes", "5 dentes de alho amassados", "Suco de 3 limões",
                 "3 colheres (sopa) de óleo", "1 colher (sopa) de colorau", "2 colheres (sopa) de sal", "1 colher (chá) de pimenta-do-reino", "1 colher (sopa) de orégano"])],
    steps=["Seque bem a pele do frango com papel-toalha.",
           "Misture alho, limão, óleo, colorau, sal, pimenta e orégano. Passe nas peças e deixe na geladeira por pelo menos 2 horas (ou de um dia para o outro).",
           "Preaqueça o forno a 200 °C.",
           "Distribua o frango em <b>duas assadeiras rasas</b>, com a pele para cima, e espalhe as batatas temperadas com sal e um fio de óleo.",
           "Asse por 50 a 60 minutos, virando as batatas na metade, até a pele ficar bem dourada.",
           "Confira o cozimento: o suco que escorre sai claro, sem rosado, e a carne solta do osso (com termômetro, mais de 70 °C perto do osso)."],
    tips=[("tip", "Truque de crocância:", "pele seca doura melhor. Assadeira lotada faz o frango cozinhar no vapor em vez de dourar.")],
    ahead="Tempere na véspera. Asse no dia, porque o frango assado fica melhor saindo do forno.",
    keep="Geladeira: 3 a 4 dias. Desfiado e congelado: até 3 meses.",
    swap="Sem colorau, use páprica doce. Batata-doce também combina e costuma ser barata.")

add(id="r-torta", cat="Prato principal · vegetariano", title="Torta de legumes de liquidificador",
    intro="A opção para convidados vegetarianos, que também agrada a todos como acompanhamento. Usa ingredientes que já estão na lista.",
    chips=["12 pedaços", "Preparo: 15 min", "Forno: ~45 min", "Custo: ~R$ 25"],
    ing=[("Massa", ["3 ovos", "2 xícaras (chá) de leite", "½ xícara (chá) de óleo", "2 xícaras (chá) de farinha de trigo",
                    "3 colheres (sopa) de queijo ralado", "1 colher (chá) de sal", "1 colher (sopa) de fermento químico"]),
         ("Recheio", ["1 cenoura ralada", "1 lata de milho escorrido", "1 lata de ervilha escorrida", "1 tomate sem sementes picado",
                      "½ cebola picada", "Cheiro-verde a gosto"])],
    steps=["Preaqueça o forno a 180 °C e unte uma forma retangular média (cerca de 30 x 20 cm) com óleo e farinha.",
           "Bata no liquidificador os ovos, o leite, o óleo, o queijo e o sal. Junte a farinha aos poucos e bata até ficar lisa. Por último, misture o fermento com uma colher.",
           "Misture todos os ingredientes do recheio em uma tigela.",
           "Coloque metade da massa na forma, espalhe o recheio e cubra com o restante da massa.",
           "Asse por 40 a 45 minutos, até dourar e o palito sair limpo. Espere 10 minutos antes de cortar."],
    ahead="Sim. Asse no dia 23 ou na manhã do dia 24 e sirva em temperatura ambiente ou reaquecida.",
    keep="Geladeira: até 3 dias, coberta.",
    swap="Use o que tiver: abobrinha, chuchu ralado e espremido, palmito ou sobras de legumes.",
    err="Recheio muito molhado deixa a torta crua no meio. Escorra bem as latas e tire as sementes do tomate.")

add(id="r-arroz", cat="Acompanhamento", title="Arroz natalino",
    intro="Colorido e farto, combina com qualquer prato principal.",
    chips=["10 porções", "Preparo: 30 min", "Custo: ~R$ 12"],
    ing=[(None, ["4 xícaras (chá) de arroz", "1 cebola picada", "2 dentes de alho", "1 cenoura ralada", "½ lata de milho verde",
                 "1 lata de ervilha escorrida", "50 g de uva-passa (opcional)", "2 colheres (sopa) de óleo",
                 "8 xícaras de água quente (ou parte do caldo do frango do salpicão)", "Sal a gosto"])],
    steps=["Refogue a cebola e o alho no óleo. Junte o arroz lavado e escorrido e mexa por 2 minutos.",
           "Acrescente a cenoura e a água quente com sal. Cozinhe em fogo médio.",
           "Quando a água secar e o arroz estiver quase macio, abaixe o fogo e tampe por 10 minutos.",
           "Junte milho, ervilha e passas. Solte com um garfo e sirva."],
    tips=[("tip", "Economia com sabor:", "use o caldo do cozimento do peito de frango (salpicão) no lugar de parte da água.")],
    ahead="Pode deixar os legumes picados no dia 23. O arroz em si fica melhor feito na hora (dia 24, 20h30).",
    keep="Geladeira: até 3 dias. Congelado: até 1 mês.",
    swap="Quem não gosta de passas? Sirva-as num potinho à parte.")

add(id="r-lentilha", cat="Acompanhamento · vegetariano", title="Arroz com lentilha e cebola dourada",
    intro="Tradição de Ano-Novo em muitas famílias, barato e cheio de sabor. Ótimo para o cardápio caprichado ou para convidados vegetarianos.",
    chips=["10 porções", "Preparo: 45 min", "Custo: ~R$ 15"],
    ing=[(None, ["1 xícara (chá) de lentilha", "2 xícaras (chá) de arroz", "3 cebolas em meia-lua fina", "5 colheres (sopa) de óleo",
                 "2 dentes de alho", "1 colher (chá) de cominho (opcional)", "Sal a gosto", "Cheiro-verde para finalizar"])],
    steps=["Cozinhe a lentilha em água por 12 a 15 minutos, até ficar macia mas inteira. Escorra.",
           "Em outra panela, doure as cebolas em 4 colheres de óleo, em fogo médio-baixo, mexendo de vez em quando, por 20 a 25 minutos, até ficarem bem douradas. Reserve metade.",
           "Na mesma panela, junte o óleo restante, o alho e o arroz. Mexa por 2 minutos.",
           "Acrescente a lentilha, o cominho, sal e 4 xícaras de água quente. Cozinhe até secar, tampe e descanse 10 minutos.",
           "Sirva coberto com a cebola reservada e cheiro-verde."],
    ahead="Doure a cebola no dia 23 e guarde na geladeira.",
    keep="Geladeira: até 3 dias.",
    err="Apressar a cebola em fogo alto: ela queima por fora e fica amarga. O segredo é fogo baixo e paciência.")

add(id="r-farofa", cat="Acompanhamento", title="Farofa de Natal",
    intro="Crocante, perfumada e uma das coisas mais baratas da mesa.",
    chips=["10 porções", "Preparo: 20 min", "Custo: ~R$ 15"],
    ing=[(None, ["500 g de farinha de mandioca torrada", "1 cebola picada", "3 dentes de alho", "1 cenoura ralada",
                 "4 colheres (sopa) de margarina", "50 g de uva-passa (opcional)", "1 maço de cheiro-verde picado", "Sal e pimenta a gosto"])],
    steps=["Derreta a margarina e refogue a cebola e o alho até dourarem.",
           "Junte a cenoura e as passas e mexa por 2 minutos.",
           "Adicione a farinha aos poucos, mexendo sempre, até ficar soltinha e levemente dourada.",
           "Desligue o fogo, acerte o sal e misture o cheiro-verde."],
    ahead="Sim. Faça no dia 23 (sem o cheiro-verde) e guarde em pote bem fechado. Junte o cheiro-verde na hora de servir.",
    keep="Pote fechado: até 5 dias. Evite umidade.",
    swap="Tem bacon ou linguiça sobrando? 100 g picados e fritos no início dão outro nível de sabor.")

add(id="r-paoalho", cat="Entrada", title="Pão de alho caseiro",
    intro="Para servir enquanto o pernil descansa. Custa uma fração do pão de alho pronto e some da mesa.",
    chips=["20 unidades", "Preparo: 15 min", "Forno: ~12 min", "Custo: ~R$ 14"],
    ing=[(None, ["10 pães franceses (podem ser do dia anterior)", "5 dentes de alho bem amassados", "3 colheres (sopa) de margarina em temperatura ambiente",
                 "3 colheres (sopa) de maionese", "2 colheres (sopa) de queijo ralado (opcional)", "1 colher (chá) de orégano", "Cheiro-verde picado"])],
    steps=["Misture alho, margarina, maionese, queijo, orégano e cheiro-verde até formar uma pasta.",
           "Corte os pães em 4 ou 5 fatias <b>sem separar a base</b> (em leque) ou ao meio no sentido do comprimento.",
           "Recheie as fendas com a pasta.",
           "Asse a 200 °C por 10 a 12 minutos, até dourar. Na airfryer: 180 °C por 6 a 8 minutos.",
           "Sirva quente, cortado em pedaços."],
    ahead="Faça a pasta no dia 23 e guarde na geladeira. Recheie os pães na tarde do dia 24.",
    keep="A pasta dura 3 dias na geladeira. O pão recheado e cru pode ser congelado por 1 mês.",
    swap="Sem maionese? Use só margarina (5 colheres).")

add(id="r-salpicao", cat="Salada fria", title="Salpicão de frango",
    intro="Pode ser feito na véspera e é o que mais enche a mesa por menos dinheiro.",
    chips=["10 porções", "Preparo: 40 min", "Custo: ~R$ 40"],
    ing=[(None, ["1 kg de peito de frango", "1 cebola e 2 folhas de louro (para cozinhar)", "2 cenouras raladas", "2 maçãs picadas com casca",
                 "1 lata de milho verde", "½ xícara de uva-passa (opcional)", "1 xícara de maionese", "1 caixa de creme de leite",
                 "2 pacotes de batata palha", "Sal e pimenta a gosto"])],
    steps=["Cozinhe o peito em água com cebola, louro e sal por cerca de 25 minutos. <b>Guarde o caldo</b> para o arroz.",
           "Deixe esfriar, desfie bem fino e misture com cenoura, maçã, milho e passas.",
           "Junte a maionese e o creme de leite, ajuste o sal e leve à geladeira.",
           "Só na hora de servir, cubra com a batata palha para ela continuar crocante."],
    tips=[("tip", "Maçã sem escurecer:", "pique a maçã por último e misture logo com a maionese, ou regue com gotas de limão.")],
    ahead="Cozinhe e desfie o frango no dia 23. Monte o salpicão na manhã do dia 24.",
    keep="Geladeira: até 2 dias. Não congele (a maionese desanda).",
    swap="Use maionese industrializada. Maionese caseira com ovo cru é arriscada em dias quentes.")

add(id="r-maionese", cat="Salada fria", title="Maionese de batata com cenoura",
    intro="Clássico que agrada crianças e adultos e custa pouco.",
    chips=["10 porções", "Preparo: 35 min", "Geladeira: 2 h", "Custo: ~R$ 20"],
    ing=[(None, ["2 kg de batatas", "3 cenouras", "1 lata de ervilha escorrida", "1 cebola pequena ralada",
                 "½ xícara de maionese (ajuste a gosto)", "1 maço de cheiro-verde", "Sal e pimenta a gosto"])],
    steps=["Descasque e corte batatas e cenouras em cubos médios.",
           "Cozinhe em água com sal até ficarem macias, sem desmanchar (teste com um garfo). Escorra e deixe esfriar.",
           "Misture com ervilha, cebola e cheiro-verde.",
           "Adicione a maionese aos poucos até o ponto de que gostar. Acerte o sal.",
           "Leve à geladeira por pelo menos 2 horas antes de servir."],
    tips=[("alert", "Segurança alimentar:", "saladas com maionese e frango ficam na geladeira até a hora de servir e não devem passar mais de 2 horas fora dela (1 hora em dias muito quentes).")],
    ahead="Cozinhe batatas e cenouras no dia 23. Monte na manhã do dia 24.",
    keep="Geladeira: até 2 dias. Não congele.",
    err="Misturar a maionese com a batata ainda quente: ela fica oleosa e estraga mais rápido.")

add(id="r-salada", cat="Salada fresca", title="Salada verde com vinagrete de laranja",
    intro="Leve, fresca e equilibra a mesa cheia de pratos cremosos. Aproveita as laranjas da lista.",
    chips=["10 porções", "Preparo: 15 min", "Custo: ~R$ 18"],
    ing=[("Salada", ["2 pés de alface", "1 kg de tomate", "½ cebola em fatias finas", "Folhas de hortelã ou cheiro-verde (opcional)"]),
         ("Vinagrete de laranja", ["Suco de 1 laranja", "4 colheres (sopa) de azeite ou óleo", "1 colher (sopa) de vinagre",
                                   "1 colher (chá) de açúcar ou mel", "Sal e pimenta a gosto"])],
    steps=["Lave bem as folhas, seque e rasgue com as mãos.",
           "Corte os tomates em gomos e a cebola em fatias finas (deixe a cebola 10 minutos em água gelada para suavizar).",
           "Bata os ingredientes do vinagrete com um garfo em um pote com tampa.",
           "Monte a salada e <b>tempere só na hora de servir</b>, para as folhas não murcharem."],
    ahead="Lave e seque as folhas no dia 23 e guarde em pote com papel-toalha na geladeira. O vinagrete dura 3 dias.",
    keep="Salada temperada não guarda bem: tempere só o que for comer.")

add(id="r-rabanada", cat="Sobremesa", title="Rabanada tradicional (frita ou assada)",
    intro="Transforma pão amanhecido em sobremesa nobre. A versão assada usa pouco óleo e dá menos trabalho.",
    chips=["~40 fatias", "Preparo: 40 min", "Custo: ~R$ 20"],
    ing=[(None, ["15 pães franceses amanhecidos, fatiados em 2 cm", "500 ml de leite", "2 colheres (sopa) de açúcar", "4 ovos batidos"]),
         ("Para finalizar", ["Óleo para fritar (ou 3 colheres de margarina derretida na versão assada)", "1 xícara de açúcar + 2 colheres (sopa) de canela"])],
    steps=["Misture o leite com as 2 colheres de açúcar.",
           "Passe cada fatia rapidamente no leite (sem encharcar) e depois nos ovos batidos.",
           "<b>Frita:</b> frite em óleo em temperatura média até dourar dos dois lados e escorra em papel-toalha.",
           "<b>Assada:</b> arrume em assadeira untada e asse a 200 °C por 12 a 15 minutos de cada lado. Na airfryer: 180 °C por 8 a 10 minutos, virando na metade.",
           "Ainda quente, pincele com margarina derretida (na versão assada) e passe na mistura de açúcar e canela."],
    tips=[("tip", "Pão amanhecido é essencial:", "pão fresco desmancha no leite. Compre 1 ou 2 dias antes e deixe fora do saco.")],
    ahead="Pode fazer na tarde do dia 24 (fica ótima em temperatura ambiente). Os pães são comprados no dia 22.",
    keep="Pote fechado: 2 dias. Congelada: até 1 mês (reaqueça na airfryer).",
    swap="Calda rápida: 1 caixa de leite condensado + ½ caixa de leite, fervidos por 3 minutos, para regar.")

add(id="r-pave", cat="Sobremesa", title="Pavê de chocolate",
    intro="Cremoso, clássico e feito na véspera.",
    chips=["10 porções", "Preparo: 30 min", "Geladeira: 6 h", "Custo: ~R$ 44"],
    ing=[("Creme", ["750 ml de leite", "1 caixa de leite condensado", "3 colheres (sopa) de amido de milho", "2 gemas", "2 caixas de creme de leite"]),
         ("Montagem", ["3 pacotes de bolacha maisena", "250 ml de leite (para molhar a bolacha)", "4 colheres (sopa) de achocolatado"])],
    steps=["Em uma panela, misture os 750 ml de leite, o leite condensado, o amido e as gemas. Leve ao fogo baixo, mexendo sem parar, até engrossar bem e ferver por 1 minuto.",
           "Desligue, deixe amornar e misture o creme de leite.",
           "Em uma travessa, alterne camadas: bolacha molhada rapidamente no leite, creme, bolacha, creme. Termine com creme.",
           "Polvilhe o achocolatado e leve à geladeira por pelo menos 6 horas."],
    ahead="Sim. Faça no dia 23. Fica até melhor no dia seguinte.",
    keep="Geladeira: até 3 dias.",
    swap="Achocolatado no lugar de chocolate em barra e bolacha de marca própria mantêm o sabor e baixam o custo.")

add(id="r-mousse", cat="Sobremesa", title="Mousse de maracujá",
    intro="Três ingredientes, 10 minutos e nenhum fogão.",
    chips=["10 taças pequenas", "Preparo: 10 min", "Geladeira: 4 h", "Custo: ~R$ 20"],
    ing=[(None, ["1 caixa de leite condensado", "1 caixa de creme de leite", "2 polpas de maracujá (100 g cada) com ½ xícara de água"])],
    steps=["Bata tudo no liquidificador por 3 a 4 minutos, até ficar espesso e cremoso.",
           "Distribua em taças ou copinhos.",
           "Leve à geladeira por pelo menos 4 horas."],
    ahead="Sim. Faça no dia 23.",
    keep="Geladeira: até 3 dias.",
    swap="Com fruta in natura: use a polpa coada de 2 maracujás grandes com ½ xícara de água.")

add(id="r-pudim", cat="Sobremesa · cardápio caprichado", title="Pudim de leite condensado",
    intro="O clássico das festas brasileiras, com ingredientes simples e preparo na véspera.",
    chips=["8 a 10 fatias", "Preparo: 20 min", "Forno: ~1h15", "Geladeira: 6 h", "Custo: ~R$ 16"],
    ing=[("Calda", ["1 xícara (chá) de açúcar", "½ xícara (chá) de água"]),
         ("Pudim", ["1 caixa de leite condensado", "A mesma medida (caixa) de leite", "3 ovos"])],
    steps=["Calda: derreta o açúcar em fogo baixo, sem mexer, até ficar dourado. Junte a água com cuidado (espirra) e mexa até dissolver. Espalhe na forma de furo central (cerca de 20 cm).",
           "Bata no liquidificador o leite condensado, o leite e os ovos por 2 minutos.",
           "Despeje na forma caramelizada e cubra com papel-alumínio.",
           "Asse em <b>banho-maria</b> (a forma dentro de uma assadeira com água quente) a 180 °C por cerca de 1h15, até firmar.",
           "Espere esfriar, leve à geladeira por pelo menos 6 horas e desenforme."],
    tips=[("tip", "Pudim lisinho, sem furinhos:", "bata pouco, deixe a mistura descansar 10 minutos antes de assar e mantenha o forno em temperatura moderada.")],
    ahead="Sim. Faça no dia 23.",
    keep="Geladeira: até 3 dias, coberto.",
    err="Mexer o açúcar enquanto derrete: ele cristaliza e a calda empedra.")

add(id="r-ponche", cat="Bebida", title="Ponche natalino de uva (sem álcool)",
    intro="Resolve as bebidas com estilo, serve todas as idades e deixa a mesa bonita.",
    chips=["~3 litros", "Preparo: 10 min", "Custo: ~R$ 20"],
    ing=[(None, ["1 litro de suco de uva integral bem gelado", "2 litros de água com gás gelada", "1 laranja em rodelas", "1 maçã em fatias finas",
                 "1 limão em rodelas", "Gelo à vontade", "Opcional: 2 paus de canela"])],
    steps=["Em uma jarra grande ou bacia, coloque as frutas e a canela.",
           "Na hora de servir, junte o suco de uva e a água com gás.",
           "Acrescente gelo e sirva em copos."],
    tips=[("tip", "Monte na hora:", "a água com gás perde o gás se ficar muito tempo aberta.")],
    ahead="Corte as frutas no fim da tarde do dia 24 e guarde na geladeira.",
    keep="Sem a água com gás, a mistura dura 1 dia na geladeira.")

add(id="r-agua", cat="Bebida", title="Água saborizada de laranja e canela",
    intro="Custa quase nada, substitui parte do refrigerante e deixa a mesa com cara de festa.",
    chips=["2 litros", "Preparo: 5 min", "Descanso: 1 h", "Custo: ~R$ 6"],
    ing=[(None, ["2 litros de água gelada", "1 laranja em rodelas finas", "2 paus de canela", "Folhas de hortelã (opcional)", "Gelo"])],
    steps=["Coloque as frutas, a canela e a hortelã em uma jarra.",
           "Complete com a água e leve à geladeira por pelo menos 1 hora.",
           "Sirva com gelo. Dá para completar com mais água 1 ou 2 vezes."],
    tips=[("tip", "Outras combinações:", "limão e hortelã; maçã e canela; laranja e cravo.")],
    keep="Geladeira: até 1 dia (depois, retire as frutas).")

# ---------------------------------------------------------------- lista de compras (10 pessoas, pernil)
LIST = [
 ("Carnes", [("Pernil suíno com osso", "3,5 kg", 70), ("Peito de frango (salpicão)", "1 kg", 18)]),
 ("Hortifrúti", [("Batata", "2 kg", 12), ("Cenoura", "1 kg", 6), ("Cebola", "1 kg", 6), ("Alho", "3 cabeças", 5), ("Laranja", "2 kg", 8),
                 ("Limão", "8 un.", 5), ("Maçã", "4 un.", 6), ("Alface", "2 pés", 8), ("Tomate", "1 kg", 8), ("Cheiro-verde", "2 maços", 5)]),
 ("Mercearia", [("Arroz branco", "1 kg", 6), ("Farinha de mandioca torrada", "500 g", 6), ("Uva-passa", "100 g", 7), ("Milho verde (lata)", "2 latas", 8),
                ("Ervilha (lata)", "2 latas", 8), ("Maionese (pote 500 g)", "1 pote", 9), ("Creme de leite (salpicão)", "1 caixa", 5),
                ("Batata palha (140 g)", "2 pacotes", 12), ("Margarina (pote 250 g)", "1 pote", 7), ("Óleo de soja (900 ml)*", "1 garrafa", 7),
                ("Sal, pimenta, louro e orégano*", "1 kit", 10), ("Ovos", "1 dúzia", 14), ("Açúcar (1 kg)*", "1 pacote", 5)]),
 ("Sobremesas", [("Creme de leite (pavê)", "2 caixas", 10), ("Leite condensado (pavê)", "1 caixa", 7), ("Bolacha maisena (pavê)", "3 pacotes", 12),
                 ("Amido de milho 200 g (pavê e molho)", "1 caixa", 5), ("Achocolatado em pó (pavê)", "1 pote", 5), ("Leite 1 L (pavê)", "1 caixa", 5),
                 ("Leite condensado (mousse)", "1 caixa", 7), ("Creme de leite (mousse)", "1 caixa", 5), ("Polpa de maracujá 100 g (mousse)", "2 pacotes", 8),
                 ("Pão francês (rabanada, compre 1 a 2 dias antes)", "15 un.", 12), ("Leite 1 L (rabanada)", "1 caixa", 5), ("Canela em pó*", "1 pacote", 3)]),
 ("Bebidas", [("Suco de uva integral (1 L)", "1 garrafa", 14), ("Água com gás (2 L)", "1 garrafa", 6), ("Refrigerante (2 L)", "3 garrafas", 21)]),
]
TOTAL = sum(p for _, its in LIST for _, _, p in its)
assert TOTAL == 386, TOTAL

EXTRAS = [
 ("Pudim (caprichado)", [("Leite condensado", "1 caixa", 7), ("Leite 1 L", "1 caixa", 5)], "Ovos e açúcar já estão na lista."),
 ("Pão de alho (caprichado)", [("Pão francês", "10 un.", 8), ("Queijo ralado 50 g", "1 pacote", 6)], "Alho, margarina e maionese já estão na lista."),
 ("Arroz com lentilha (caprichado)", [("Lentilha", "500 g", 9), ("Cebola extra", "1 kg", 6)], "Use 2 xícaras do arroz da lista ou compre +1 kg (R$ 6) se fizer os dois arrozes."),
 ("Torta de legumes (vegetariano)", [("Farinha de trigo", "1 kg", 6), ("Leite 1 L", "1 caixa", 5), ("Fermento químico", "1 pote", 4),
                                     ("Queijo ralado 50 g", "1 pacote", 6), ("Milho e ervilha extras", "2 latas", 8)], "Ovos, óleo e legumes frescos já estão na lista."),
 ("Água saborizada", [("Canela em pau", "1 pacote", 4)], "Laranja e hortelã: use as da lista."),
]
CAPR = TOTAL + 12 + 14 + 15
ESSEN = 373 - 44 - 21 + 4  # frango, sem pavê e sem refrigerante, + canela da água saborizada

def shop_html():
    h = ""
    for cat, its in LIST:
        rows = [[f'<span class="cb"></span> {n}', q, R(p), '<span class="blank"></span>'] for n, q, p in its]
        h += f'<p class="shcat">{cat}</p>' + table(["Item", "Quantidade", "Estimado", "Encontrei"], rows, "shop")
    return h

def extras_html():
    h = ""
    for title, its, note in EXTRAS:
        rows = [[f'<span class="cb"></span> {n}', q, R(p)] for n, q, p in its]
        h += f'<p class="shcat">{title} · +{R(sum(p for _,_,p in its))}</p>' + table(["Item", "Quantidade", "Estimado"], rows, "shop") + f'<p class="note">{note}</p>'
    return h

# ---------------------------------------------------------------- páginas
cover = f'''<section class="cover">
<div class="cframe">
<p class="orn">✦ ✦ ✦</p><p class="ckick">Guia prático · Edição completa</p>
<h1>Ceia de Natal<br>Econômica</h1>
<p class="csub">Cardápio, 17 receitas, lista de compras com preços, cronograma e planilhas para uma ceia farta de 8 a 10 pessoas, gastando pouco e sem perder o sabor da festa.</p>
<svg class="tree" viewBox="0 0 100 130"><circle cx="50" cy="8" r="6" fill="#b08a3e"/><polygon points="50,14 72,48 60,48 80,80 64,80 88,112 12,112 36,80 20,80 40,48 28,48" fill="#2f5d46"/>
<circle cx="44" cy="58" r="3.5" fill="#9b2c2c"/><circle cx="60" cy="74" r="3.5" fill="#b08a3e"/><circle cx="38" cy="92" r="3.5" fill="#b08a3e"/><circle cx="64" cy="98" r="3.5" fill="#9b2c2c"/>
<rect x="44" y="112" width="12" height="14" fill="#6b4423"/></svg>
<div class="cstats"><div><b>17</b><span>receitas</span></div><div><b>~R$ 39</b><span>por pessoa*</span></div><div><b>4</b><span>planilhas</span></div></div>
<p class="cby">Ebooks Práticos · Edição 2026</p>
<p class="cnote">*Estimativa para 10 pessoas com preços médios de supermercado. Os valores variam por região.</p>
</div></section>'''

dummy = '<section class="dummy"></section>'

TOC = [("start", "Comece por aqui", 0), ("intro", "Introdução: a ceia que cabe no bolso", 0),
       ("p1", "Parte 1 · Planejar", -1), ("c1", "1. Planeje antes de gastar", 0), ("c2", "2. Escolha o seu cardápio", 0),
       ("c3", "3. Para 4 a 12 pessoas", 0), ("c4", "4. Divida a ceia sem constrangimento", 0),
       ("p2", "Parte 2 · Cozinhar", -1), ("c5", "5. Pratos principais", 0), ("c6", "6. Acompanhamentos e entrada", 0),
       ("c7", "7. Saladas", 0), ("c8", "8. Sobremesas", 0), ("c9", "9. Bebidas", 0),
       ("p3", "Parte 3 · Comprar", -1), ("c10", "10. Lista de compras", 0), ("c11", "11. Planilha de pesquisa de preços", 0), ("c12", "12. Como pagar menos no mercado", 0),
       ("p4", "Parte 4 · Executar", -1), ("c13", "13. Cronograma: do dia 20 ao dia 25", 0), ("c14", "14. Segurança alimentar", 0),
       ("c15", "15. Mesa bonita sem gastar", 0), ("c16", "16. Aproveitando as sobras", 0), ("c17", "17. Dúvidas frequentes", 0),
       ("fim", "Seu plano em 6 passos", 0), ("medidas", "Medidas caseiras", 0), ("notas", "Minhas anotações", 0)]

def toc_html():
    lis = ""
    for i, t, kind in TOC:
        cls = "tp" if kind == -1 else ""
        lis += f'<li class="{cls}"><span class="tt">{t}</span><span class="dots"></span><span class="pg" data-pg="{i}">00</span></li>'
    recs = "".join(f'<li><span class="tt">{REC[k]["title"]}</span><span class="dots"></span><span class="pg" data-pg="{k}">00</span></li>' for k in REC)
    return f'''<section class="toc"><p class="kick">Sumário</p><h2>O que você vai encontrar</h2><div class="rule"></div><ul class="toc">{lis}</ul></section>
<section class="toc"><p class="kick">Índice de receitas</p><h2>As 17 receitas</h2><div class="rule"></div><ul class="toc">{recs}</ul>
<p class="note">E mais 5 ideias de receitas com sobras no capítulo 16.</p></section>'''

start = chapter("start", "Antes de tudo", "Comece por aqui", "Você não precisa ler este guia inteiro de uma vez. Siga estes 5 passos e, em 15 minutos, a sua ceia estará planejada.",
 '<ol class="steps5">'
 '<li><b>Defina quantas pessoas e quanto quer gastar</b> no quadro do capítulo 1.</li>'
 '<li><b>Escolha um dos 3 cardápios</b> do capítulo 2: Essencial, Tradicional ou Caprichado.</li>'
 '<li><b>Ajuste as quantidades</b> com a tabela do capítulo 3, se forem menos ou mais de 10 pessoas.</li>'
 '<li><b>Imprima a lista de compras</b> (capítulo 10) e a planilha de preços (capítulo 11). Compare antes de comprar.</li>'
 '<li><b>Cole o cronograma</b> (capítulo 13) na porta da geladeira e siga dia a dia.</li></ol>'
 + tip("tip", "Leia no celular ou imprima.", "As páginas com caixinhas e espaços em branco (quadro de planejamento, lista de compras, planilha de preços, quem leva o quê e anotações) foram feitas para imprimir e preencher à caneta.")
 + '<p class="sub2">Como ler as receitas</p>'
 + '<p>Cada receita traz rendimento, tempos e custo estimado e, no fim, quatro quadros práticos:</p>'
 + '<ul><li><b>Dá para adiantar?</b> O que pode ser feito antes, para a noite de 24 não virar maratona.</li>'
   '<li><b>Como guardar:</b> quanto tempo dura na geladeira e no congelador.</li>'
   '<li><b>Troque e economize:</b> substituições mais baratas ou para quando faltar algo.</li>'
   '<li><b>Erro comum:</b> o deslize que mais estraga aquele prato e como evitar.</li></ul>'
 + tip("alert", "Sobre os preços:", "são estimativas médias de supermercado e variam por cidade, mercado e semana. Use como referência e compare com os preços da sua região na planilha do capítulo 11."))

intro = chapter("intro", "Introdução", "A ceia que cabe no bolso",
 "O Natal não precisa de mesa cara para ser inesquecível. O que as pessoas lembram é do cheiro da comida saindo do forno, da casa cheia e de quem se sentou junto.",
 '<p>Só que, todo ano, a conta da ceia assusta: carnes caras, muitos pratos, compras de última hora e sobras que estragam. Este guia mostra o caminho oposto: <b>poucos pratos bem escolhidos, ingredientes que se repetem e um plano claro</b> de compras e preparo.</p>'
 '<p class="sub2">O que você vai encontrar</p><ul>'
 '<li>Três cardápios prontos, de cerca de <b>R$ 31 a R$ 43 por pessoa</b> (estimativa para 10 pessoas).</li>'
 '<li><b>17 receitas</b> passo a passo, com opção sem forno e opções vegetarianas.</li>'
 '<li>Lista de compras com quantidades e preços estimados, e planilha para comparar mercados.</li>'
 '<li>Tabela de quantidades para <b>4 a 12 pessoas</b>.</li>'
 '<li>Cronograma do dia 20 ao dia 25 e checklist da noite de 24.</li>'
 '<li>Guia de segurança alimentar, mesa posta barata e receitas com as sobras.</li></ul>'
 + tip("tip", "A ideia central:", "uma só carne, fartura nos acompanhamentos, sobremesas feitas na véspera e compras planejadas. É isso que derruba a conta, não cortar o sabor."))

part1 = part("p1", 1, "Planejar", "Antes de entrar no mercado, decida quanto gastar, o que servir e quanto comprar.",
             ["Planeje antes de gastar", "Escolha o seu cardápio", "Para 4 a 12 pessoas", "Divida a ceia sem constrangimento"])

c1 = chapter("c1", "Capítulo 1", "Planeje antes de gastar",
 "O segredo de uma ceia econômica é decidir o teto de gastos antes de entrar no mercado, e só depois escolher o cardápio.",
 '<p>Muita gente começa pela lista dos pratos dos sonhos e só descobre o preço no caixa. Vamos fazer o contrário.</p>'
 '<p class="sub2">Quanto servir por pessoa</p>'
 + table(["Item", "Por pessoa", "Para 10 pessoas"], [
   ["Pernil com osso", "350 a 400 g", "3,5 kg"], ["Carne sem osso", "250 g", "2,5 kg"], ["Coxa e sobrecoxa", "400 g", "4 kg"],
   ["Arroz (cru)", "~75 g", "4 xícaras"], ["Farofa (farinha)", "50 g", "500 g"], ["Saladas frias", "150 a 200 g", "2 saladas"],
   ["Sobremesas", "1,5 porção", "2 a 3 tipos"], ["Bebidas (tudo somado)", "~900 ml", "9 litros"], ["Gelo", "~500 g", "5 kg"]])
 + '<p class="sub2">As 5 regras de ouro</p><ol>'
 '<li><b>Defina o teto e anote.</b> Ele guia todas as escolhas.</li>'
 '<li><b>Uma só proteína.</b> Duas ou três carnes dobram a conta sem melhorar a festa.</li>'
 '<li><b>Fartura nos acompanhamentos:</b> são baratos e saciam.</li>'
 '<li><b>Repita ingredientes:</b> a cenoura entra no arroz, na farofa, no salpicão e na maionese.</li>'
 '<li><b>Cozinhe você mesmo.</b> Pratos prontos e semiprontos custam muito mais.</li></ol>'
 '<div class="sheet"><p class="sheet-t">Seu quadro de planejamento</p>'
 '<p>Número de convidados: ______ &nbsp; Crianças: ______</p><p>Teto de gastos: R$ ____________ &nbsp; Por pessoa: R$ ________</p>'
 '<p>Cardápio: ( ) Essencial &nbsp; ( ) Tradicional &nbsp; ( ) Caprichado</p><p>Prato principal: ( ) pernil &nbsp; ( ) pernil sem forno &nbsp; ( ) frango</p>'
 '<p>Tenho forno? ( ) sim ( ) não &nbsp;&nbsp; Convidados vegetarianos? ( ) sim ( ) não</p>'
 '<p>Restrições e alergias (glúten, lactose, ovo, outros): ______________________</p>'
 '<p>Sobremesa que não pode faltar: ______________________</p></div>')

def menu_card(name, price, per, items, note):
    rows = "".join(f'<tr><td>{a}</td><td>{b}</td></tr>' for a, b in items)
    return f'''<div class="menu"><div class="mhead"><p class="mname">{name}</p><p class="mprice">{price}<span>{per}</span></p></div>
<table class="mt">{rows}</table><p class="note">{note}</p></div>'''

c2 = chapter("c2", "Capítulo 2", "Escolha o seu cardápio",
 "Três cardápios prontos, para três orçamentos. Todos são fartos; o que muda é a quantidade de pratos.",
 menu_card("Essencial", "~" + R(ESSEN), f" · ~R$ {round(ESSEN/10)} por pessoa", [
   ("Mesa fria", "Salpicão de frango · Maionese de batata · Salada verde"), ("Principal", "Coxa e sobrecoxa douradas com batatas"),
   ("Acompanhamentos", "Arroz natalino · Farofa de Natal"), ("Sobremesas", "Rabanada · Mousse de maracujá"),
   ("Bebidas", "Ponche de uva · Água saborizada")],
   "Para quem precisa economizar ao máximo. Troca o pernil pelo frango, tira o pavê e o refrigerante.")
 + menu_card("Tradicional", "~" + R(TOTAL), " · ~R$ 39 por pessoa", [
   ("Mesa fria", "Salpicão de frango · Maionese de batata · Salada verde com vinagrete de laranja"), ("Principal", "Pernil com laranja e alho (ou na pressão)"),
   ("Acompanhamentos", "Arroz natalino · Farofa de Natal"), ("Sobremesas", "Rabanada · Pavê de chocolate · Mousse de maracujá"),
   ("Bebidas", "Ponche de uva · Refrigerante · Água")],
   "O cardápio base deste guia. É o que está na lista de compras do capítulo 10.")
 + menu_card("Caprichado", "~" + R(CAPR), f" · ~R$ {round(CAPR/10)} por pessoa", [
   ("Entrada", "Pão de alho caseiro"), ("Mesa fria", "Salpicão · Maionese · Salada verde com vinagrete"), ("Principal", "Pernil com laranja e alho"),
   ("Acompanhamentos", "Arroz natalino · Arroz com lentilha · Farofa"), ("Sobremesas", "Rabanada · Pavê · Mousse · Pudim"), ("Bebidas", "Ponche · Refrigerante · Água saborizada")],
   "Para impressionar sem sair do orçamento. Some os itens extras do capítulo 10.")
 + tip("tip", "Tem convidado vegetariano?", "acrescente a torta de legumes de liquidificador e o arroz com lentilha. A farofa, a maionese de batata, a salada e as sobremesas já servem.")
 + '<p class="sub2">Para onde vai o dinheiro (cardápio Tradicional)</p>'
 + table(["Grupo", "Valor", "Parte da conta"], sorted([[c, R(v), f"{round(100*v/TOTAL)}%"] for c, v in
        [(cat if cat != "Mercearia" else "Mercearia e temperos", sum(p for _, _, p in its)) for cat, its in LIST]], key=lambda r: -int(r[2][:-1])))
 + tip("alert", "Precisa cortar?", "os lugares mais fáceis são as bebidas industrializadas e uma das sobremesas. Corte ali antes de mexer na carne."))

SC = [("Pernil com osso", "1,5 kg", "2,2 kg", "2,8 kg", "3,5 kg", "4,2 kg"), ("ou coxa e sobrecoxa", "1,6 kg", "2,4 kg", "3,2 kg", "4 kg", "4,8 kg"),
      ("Peito de frango (salpicão)", "400 g", "600 g", "800 g", "1 kg", "1,2 kg"), ("Batata (maionese)", "800 g", "1,2 kg", "1,6 kg", "2 kg", "2,4 kg"),
      ("Arroz", "2 xíc.", "2½ xíc.", "3½ xíc.", "4 xíc.", "5 xíc."), ("Farinha (farofa)", "200 g", "300 g", "400 g", "500 g", "600 g"),
      ("Pão (rabanada)", "6", "9", "12", "15", "18"), ("Bebidas", "3,6 L", "5,4 L", "7,2 L", "9 L", "11 L"),
      ("Gasto estimado", "~R$ 170", "~R$ 245", "~R$ 315", "~R$ 386", "~R$ 455")]
c3 = chapter("c3", "Capítulo 3", "Para 4 a 12 pessoas",
 "As receitas deste guia rendem 10 porções. Use esta tabela para ajustar as compras ao tamanho da sua família.",
 table(["Item", "4", "6", "8", "10", "12"], [list(r) for r in SC], "scale")
 + '<p class="note">Valores do cardápio Tradicional. Para poucas pessoas, o custo por pessoa sobe um pouco, porque temperos e embalagens não diminuem na mesma proporção.</p>'
 '<p class="sub2">Dicas para ceias pequenas (4 a 6 pessoas)</p><ul>'
 '<li>Pernil inteiro sobra muito: peça ao açougueiro <b>meio pernil</b> ou um pedaço de 1,5 a 2 kg.</li>'
 '<li>Escolha <b>2 sobremesas</b> em vez de 3. O mousse e o pudim são fáceis de fazer em meia receita.</li>'
 '<li>Faça a receita inteira de farofa: ela dura 5 dias em pote fechado.</li>'
 '<li>Prefira refrigerante de 2 litros e água saborizada a muitas latas.</li></ul>'
 '<p class="sub2">Dicas para ceias grandes (12 pessoas ou mais)</p><ul>'
 '<li>Use <b>duas assadeiras</b> e confira se o forno comporta. Se não, faça parte do pernil na pressão.</li>'
 '<li>Multiplique as saladas frias, que são o jeito mais barato de encher a mesa.</li>'
 '<li>É hora de dividir: veja o capítulo 4.</li></ul>')

c4 = chapter("c4", "Capítulo 4", "Divida a ceia sem constrangimento",
 "Dividir a ceia é tradição em muitas famílias e alivia muito o bolso de quem recebe. O segredo é combinar cedo e com clareza.",
 '<p class="sub2">Duas formas de dividir</p>'
 '<p><b>1. Cada um leva um prato.</b> Funciona bem com pratos fáceis de transportar: sobremesas, saladas, farofa, bebidas e gelo. A carne e o arroz ficam com quem recebe, porque precisam sair quentes.</p>'
 '<p><b>2. Vaquinha.</b> Some o total da lista, divida pelo número de famílias e combine o valor antes das compras. Mostre a lista: transparência evita mal-estar.</p>'
 + tip("tip", "Como pedir sem constrangimento:", "\"Vou fazer o pernil e o arroz. Quem pode trazer uma sobremesa ou as bebidas?\" Dar opções concretas facilita para todos.")
 + '<p class="sub2">O que mais faz sentido delegar</p><ul><li>Bebidas e gelo (pesam no bolso e nos braços).</li><li>Uma sobremesa (pavê e pudim viajam bem).</li>'
 '<li>A salada verde (montada na hora).</li><li>Pão de alho ou petiscos de entrada.</li></ul>'
 '<div class="sheet"><p class="sheet-t">Quem leva o quê</p>'
 + table(["Família / pessoa", "Leva", "Combinado em", "✓"], [["", "", "", ""] for _ in range(8)], "fill")
 + '<p>Total da ceia: R$ __________ ÷ ______ famílias = R$ __________ por família</p></div>')

part2 = part("p2", 2, "Cozinhar", "17 receitas testadas e explicadas passo a passo, com o que dá para adiantar e como guardar.",
             ["Pratos principais", "Acompanhamentos e entrada", "Saladas", "Sobremesas", "Bebidas"])

def recipes_chapter(cid, kick, title, lead, ids, extra=""):
    return chapter(cid, kick, title, lead, extra) + "".join(recipe(REC[i]) for i in ids)

c5 = recipes_chapter("c5", "Capítulo 5", "Pratos principais", "Uma só carne, bem feita. Escolha a que cabe no seu orçamento e no seu forno.",
 ["r-pernil", "r-pressao", "r-frango", "r-torta"],
 table(["Opção", "Custo", "Forno", "Para quem"], [["Pernil assado", "~R$ 70", "~3h30", "Cardápio Tradicional e Caprichado"], ["Pernil na pressão", "~R$ 70", "Não precisa", "Quem não tem forno ou tem forno pequeno"],
       ["Frango com batatas", "~R$ 57", "~1 h", "Cardápio Essencial ou quem não come porco"], ["Torta de legumes", "~R$ 25", "~45 min", "Convidados vegetarianos"]])
 + tip("tip", "Dica de compra:", "prefira o pernil com osso: o osso dá sabor e o quilo costuma ser mais barato. Peça ao açougueiro para manter a pele inteira. Comprando cedo, congele (veja o capítulo 14 para descongelar com segurança)."))
c6 = recipes_chapter("c6", "Capítulo 6", "Acompanhamentos e entrada", "Os acompanhamentos são o segredo da fartura barata: enchem o prato e deixam a carne brilhar.",
 ["r-arroz", "r-lentilha", "r-farofa", "r-paoalho"])
c7 = recipes_chapter("c7", "Capítulo 7", "Saladas", "As saladas frias podem ser feitas na véspera e são o que mais enche a mesa por menos dinheiro. A geladeira trabalha por você.",
 ["r-salpicao", "r-maionese", "r-salada"])
c8 = recipes_chapter("c8", "Capítulo 8", "Sobremesas", "Quatro sobremesas com ingredientes simples e preparo antecipado. Ninguém vai perceber que a conta foi pequena.",
 ["r-rabanada", "r-pave", "r-mousse", "r-pudim"],
 table(["Sobremesa", "Custo", "Quando fazer", "Cardápio"], [["Rabanada", "~R$ 20", "Tarde do dia 24", "Todos"], ["Mousse de maracujá", "~R$ 20", "Dia 23", "Todos"],
       ["Pavê de chocolate", "~R$ 44", "Dia 23", "Tradicional e Caprichado"], ["Pudim", "~R$ 16", "Dia 23", "Caprichado"]]))
c9 = recipes_chapter("c9", "Capítulo 9", "Bebidas", "As bebidas consomem boa parte do orçamento sem que ninguém perceba. Ponche e água saborizada resolvem com estilo e custam muito menos.",
 ["r-ponche", "r-agua"],
 '<p class="sub2">Como economizar nas bebidas</p><ul><li>Compre refrigerante em garrafa de 2 litros: o litro sai bem mais barato que em lata.</li>'
 '<li>Faça <b>muito gelo em casa</b> a partir do dia 20: saco de gelo comprado pesa na conta.</li>'
 '<li>Para adultos, combine que cada um leve a bebida alcoólica de sua preferência.</li>'
 '<li>Com crianças, o ponche sem álcool serve a todos e deixa a mesa mais bonita.</li></ul>')

part3 = part("p3", 3, "Comprar", "A lista completa, a planilha para comparar mercados e as estratégias que mais economizam.",
             ["Lista de compras", "Planilha de pesquisa de preços", "Como pagar menos no mercado"])

c10 = chapter("c10", "Capítulo 10", "Lista de compras",
 "Lista do cardápio Tradicional para 10 pessoas, com pernil. Imprima, leve ao mercado e marque cada item ao colocar no carrinho.",
 f'<div class="totals"><div><b>{R(TOTAL)}</b><span>Total estimado</span></div><div><b>R$ 39</b><span>Por pessoa</span></div><div><b>40</b><span>Itens</span></div></div>'
 + tip("tip", "Coluna \"Encontrei\":", "anote o preço que você achou. Itens com * costumam já estar na despensa: confira antes de comprar.")
 + shop_html()
 + '<p class="sub2">Ajustes rápidos</p><ul><li><b>Prefere frango?</b> Troque o pernil (3,5 kg) por 4 kg de coxa e sobrecoxa e acrescente 1,5 kg de batata para assar. O total vai para cerca de R$ 373.</li>'
 f'<li><b>Cardápio Essencial:</b> versão com frango, sem os itens do pavê e sem o refrigerante, mais a canela em pau da água saborizada: cerca de {R(ESSEN)}.</li>'
 '<li><b>Outro número de pessoas:</b> use a tabela do capítulo 3.</li></ul>'
 '<p class="sub2">Itens extras (cardápio Caprichado e opções)</p>' + extras_html())

c11 = chapter("c11", "Capítulo 11", "Planilha de pesquisa de preços",
 "Os itens abaixo são os que mais pesam na conta. Comparar dois ou três mercados (encartes, aplicativos ou uma visita rápida) costuma economizar mais do que qualquer troca de receita.",
 '<div class="sheet">' + table(["Item", "Mercado A", "Mercado B", "Mercado C"], [[x, "", "", ""] for x in [
   "Pernil com osso (kg)", "Coxa e sobrecoxa (kg)", "Peito de frango (kg)", "Batata (kg)", "Leite condensado", "Creme de leite", "Maionese 500 g",
   "Bolacha maisena", "Suco de uva integral 1 L", "Refrigerante 2 L", "Batata palha", "Arroz 1 kg", "Óleo 900 ml", "Ovos (dúzia)", "Total da compra"]], "fill")
 + '<p>Mercados: A = ______________ &nbsp; B = ______________ &nbsp; C = ______________</p></div>'
 + tip("tip", "Regra prática:", "compre as carnes e os laticínios onde estiverem mais baratos. Não vale a pena atravessar a cidade por R$ 2 num pacote de bolacha."))

c12 = chapter("c12", "Capítulo 12", "Como pagar menos no mercado",
 "Quem compra bem economiza mais do que quem apenas escolhe pratos baratos. Estas estratégias valem para qualquer lista.",
 '<ol class="big">'
 '<li><b>Compare o preço por quilo,</b> não o da embalagem. Pacotes \"econômicos\" nem sempre são.</li>'
 '<li><b>Pesquise com antecedência</b> em encartes e aplicativos dos mercados da sua região, usando a planilha do capítulo 11.</li>'
 '<li><b>Atacarejo para não perecíveis</b> (arroz, óleo, açúcar, leite condensado), principalmente se for dividir com outra família.</li>'
 '<li><b>Marcas próprias e intermediárias</b> costumam ter qualidade parecida por preço menor em creme de leite, bolacha, milho e ervilha.</li>'
 '<li><b>Compre a carne cedo e congele.</b> Os preços de carnes de festa tendem a subir perto do dia 24.</li>'
 '<li><b>Frescos só entre os dias 22 e 23,</b> para garantir qualidade.</li>'
 '<li><b>Feira livre</b> costuma ter frutas e verduras mais baratas, principalmente no fim do horário.</li>'
 '<li><b>Vá alimentado e com a lista na mão.</b> Fome e falta de lista são as maiores causas de compra por impulso.</li>'
 '<li><b>Use cashback e programas de fidelidade</b> do mercado que você já frequenta, sem se cadastrar em tudo só por isso.</li>'
 '<li><b>Divida a ceia</b> (capítulo 4). Ninguém se ofende em levar uma bebida ou sobremesa.</li></ol>'
 '<p class="sub2">Quando comprar cada coisa</p>'
 + table(["Quando", "O que comprar"], [["Até o dia 15", "Pernil ou frango (congele), não perecíveis no atacarejo"], ["Dia 20", "Resto dos não perecíveis, bebidas"],
                                      ["Dia 22", "Pão francês da rabanada, laticínios, carnes frescas (se não congelou)"], ["Dia 23", "Hortifrúti: alface, tomate, cheiro-verde, frutas"]])
 + '<p class="sub2">O que NÃO comprar</p><p>Pratos prontos, frios importados, castanhas e nozes caras, panetones de marca e enfeites novos. Seu orçamento rende mais em comida de verdade.</p>')

part4 = part("p4", 4, "Executar", "Do dia 20 ao dia 25: o que fazer em cada dia, com segurança e sem correria.",
             ["Cronograma do dia 20 ao dia 25", "Segurança alimentar", "Mesa bonita sem gastar", "Aproveitando as sobras", "Dúvidas frequentes"])

def day(title, items):
    return f'<div class="day"><p class="dt">{title}</p><ul>' + "".join(f'<li><span class="cb"></span> {x}</li>' for x in items) + "</ul></div>"

c13 = chapter("c13", "Capítulo 13", "Cronograma: do dia 20 ao dia 25",
 "Uma ceia tranquila é uma ceia planejada. Com este cronograma, a noite de 24 vira festa, e não maratona.",
 day("Dia 20 · Organização", ["Defina o cardápio e confirme os convidados.", "Combine quem leva o quê (capítulo 4).", "Confira a despensa e finalize a lista de compras.",
                               "Compre os não perecíveis e as bebidas.", "Comece a fazer gelo todos os dias."])
 + day("Dia 21 · Descongelar", ["Se o pernil está congelado, <b>passe-o para a geladeira hoje</b>. Uma peça de 3,5 kg leva cerca de 2 dias para descongelar.",
                                 "Separe toalha, pratos, travessas e talheres. Lave o que estiver guardado há muito tempo.", "Monte a playlist de Natal."])
 + day("Dia 22 · Compras frescas", ["Compre o pão francês da rabanada e deixe fora do saco.", "Compre os laticínios e as carnes frescas (se não congelou).",
                                     "Se for fazer o caprichado: compre os itens extras."])
 + day("Dia 23 · A grande véspera", ["<b>Manhã:</b> compre o hortifrúti fresco.",
                                      "<b>Tarde:</b> cozinhe o peito de frango (guarde o caldo), as batatas e as cenouras. Faça o pavê, o mousse e o pudim. Faça a farofa (sem o cheiro-verde) e a pasta do pão de alho.",
                                      "<b>Noite:</b> tempere o pernil (ou o frango) e deixe na geladeira. Lave e seque as folhas da salada."])
 + '<div class="day d24"><p class="dt">Dia 24 · O grande dia</p>'
 + table(["Hora", "Pernil assado", "Se for frango"], [
   ["10h", "Monte o salpicão (sem batata palha) e a maionese. Geladeira.", "Igual"], ["11h", "Torta de legumes, se houver vegetarianos.", "Igual"],
   ["15h", "Tire o pernil da geladeira.", "—"], ["16h30", "Pernil no forno a 180 °C, coberto.", "—"], ["17h", "Recheie os pães de alho. Corte as frutas do ponche.", "Igual"],
   ["18h", "Faça a rabanada.", "Igual. Tire o frango da geladeira."], ["19h30", "—", "Frango no forno a 200 °C."],
   ["19h45", "Descubra o pernil e aumente para 220 °C.", "—"], ["20h15", "Pernil descansando. Pão de alho no forno.", "Vire as batatas."],
   ["20h30", "Faça o arroz. Monte a mesa.", "Frango pronto. Pão de alho no forno. Faça o arroz."],
   ["21h", "Monte o ponche, finalize o salpicão e sirva!", "Igual"]], "sched") + '</div>'
 + day("Dia 25 · Sobras", ["Guarde tudo na geladeira em até 2 horas depois de servir.", "Almoço com as sobras (capítulo 16).", "Congele o pernil que não for usar em 2 dias."])
 + '<div class="sheet"><p class="sheet-t">Checklist da noite de 24</p><div class="cols2">'
 + "".join(f'<p><span class="cb"></span> {x}</p>' for x in ["Forno livre para o pão de alho", "Gelo no congelador", "Bebidas gelando desde a tarde",
   "Batata palha separada", "Tempero da salada pronto", "Travessas separadas", "Velas longe de tecidos", "Potes para as sobras", "Marmitinhas para os convidados", "Playlist pronta"])
 + '</div></div>'
 + tip("tip", "Dica de ouro:", "imprima esta página e cole na porta da geladeira. Você para de lembrar e passa a executar."))

c14 = chapter("c14", "Capítulo 14", "Segurança alimentar",
 "Dezembro é quente, a mesa fica cheia por horas e as quantidades são grandes. Estas regras simples evitam que alguém passe mal depois da festa.",
 '<p class="sub2">As temperaturas que importam</p>'
 + table(["Situação", "Regra"], [["Geladeira", "5 °C ou menos. Não lote: o ar frio precisa circular."], ["Carnes cozidas", "70 °C ou mais no centro (com termômetro culinário)."],
       ["Fora da geladeira", "No máximo 2 horas; 1 hora em dias muito quentes."], ["Reaquecer", "Até soltar vapor por inteiro. Reaqueça só a porção que vai comer."]])
 + '<p class="sub2">Descongelar com segurança</p><ul><li>Sempre <b>na geladeira</b>, nunca na pia ou ao sol. O pernil de 3,5 kg leva cerca de 2 dias; o frango, cerca de 1 dia.</li>'
 '<li>Coloque a peça num recipiente para o líquido não pingar em outros alimentos.</li><li>Depois de descongelada, a carne crua não deve voltar ao congelador.</li></ul>'
 '<p class="sub2">Na cozinha</p><ul><li>Use uma tábua para carne crua e outra para saladas e pães.</li><li>Lave as mãos depois de mexer em carne crua e ovos.</li>'
 '<li>Lave folhas e frutas em água corrente; para folhas, deixe de molho em solução de água sanitária própria para alimentos, conforme o rótulo, e enxágue.</li>'
 '<li>Prefira <b>maionese industrializada</b>: a caseira, com ovo cru, é arriscada no calor.</li>'
 '<li>Para esfriar grandes quantidades rápido, divida em potes rasos antes de levar à geladeira.</li></ul>'
 '<p class="sub2">Atenção às alergias e restrições</p>'
 + table(["Contém", "Pratos deste guia"], [["Glúten", "Rabanada, pavê, pão de alho, torta de legumes"], ["Lactose", "Pavê, mousse, pudim, salpicão, rabanada, torta"],
       ["Ovo", "Rabanada, pavê, pudim, torta, maionese industrializada"], ["Carne suína", "Pernil (troque pelo frango)"]])
 + tip("alert", "Cuidado redobrado", "com crianças pequenas, gestantes, idosos e pessoas com imunidade baixa: mantenha os pratos frios bem gelados e as carnes bem cozidas. Em caso de dúvida sobre alergias, pergunte aos convidados antes."))

c15 = chapter("c15", "Capítulo 15", "Mesa bonita sem gastar",
 "A mesa é metade da experiência. Com poucos elementos e criatividade, ela fica elegante sem custo relevante.",
 '<p class="sub2">Ideias baratas que funcionam</p><ul>'
 '<li><b>Toalha branca ou lençol bem passado.</b> A cor neutra valoriza a comida.</li>'
 '<li><b>Centro de mesa com frutas:</b> laranjas espetadas com cravos, maçãs vermelhas e galhinhos de alecrim ou folhas verdes.</li>'
 '<li><b>Velas simples em potes de vidro,</b> sempre longe de tecidos, papéis e ramos secos.</li>'
 '<li><b>Guardanapos de papel</b> dobrados em formato de árvore ou leque, presos com barbante.</li>'
 '<li><b>Pinhas, folhas e galhos</b> pintados com tinta spray dourada ou prateada.</li>'
 '<li><b>Plaquinhas com o nome dos pratos</b> em papel dobrado: deixa a mesa com cara de bufê e ajuda quem tem restrições.</li></ul>'
 '<p class="sub2">Como montar a mesa</p><ul><li>Pratos quentes no centro, saladas frias nas pontas, perto de quem vai repor.</li>'
 '<li>Monte uma <b>estação de bebidas</b> separada (ponche, água, gelo e copos) para o fluxo não travar a mesa.</li>'
 '<li>Sobremesas ficam na geladeira até a hora delas e entram depois.</li>'
 '<li>Separe pratos, talheres e copos no dia anterior.</li></ul>'
 + tip("alert", "Segurança:", "nunca deixe velas acesas sem supervisão, principalmente com crianças e animais por perto."))

c16 = chapter("c16", "Capítulo 16", "Aproveitando as sobras",
 "Comida sobrando é dinheiro sobrando. Um bom plano para o dia 25 transforma a ceia em mais duas refeições.",
 '<p class="sub2">Quanto tempo dura cada prato</p>'
 + table(["Prato", "Geladeira", "Congelador"], [["Pernil e frango", "3 a 4 dias", "3 meses"], ["Arroz", "3 dias", "1 mês"], ["Farofa (pote fechado)", "5 dias", "—"],
       ["Salpicão e maionese", "2 dias", "Não congele"], ["Rabanada", "2 dias", "1 mês"], ["Pavê, mousse e pudim", "3 dias", "Não recomendado"]])
 + '<p class="note">Guarde em potes tampados em até 2 horas depois de servir.</p>'
 '<p class="sub2">5 receitas com as sobras</p>'
 '<div class="mini"><p class="mt2">Sanduíche de pernil desfiado</p><p>Desfie o pernil, aqueça com o molho da assadeira e sirva no pão francês com alface, tomate e um pouco de vinagrete.</p></div>'
 '<div class="mini"><p class="mt2">Escondidinho de pernil</p><p>Cozinhe 1 kg de batata e amasse com 2 colheres de margarina e leite até virar purê. Em uma travessa, faça uma camada de pernil desfiado refogado com cebola, cubra com o purê e queijo ralado. Forno a 200 °C por 20 minutos.</p></div>'
 '<div class="mini"><p class="mt2">Arroz de forno</p><p>Misture o arroz que sobrou com frango ou pernil desfiado, milho, ervilha e 1 caixa de creme de leite. Cubra com queijo ralado e leve ao forno a 200 °C por 15 a 20 minutos.</p></div>'
 '<div class="mini"><p class="mt2">Sopa do osso do pernil</p><p>Cozinhe o osso com 2 litros de água, cebola, alho, batata e cenoura por 40 minutos. Retire o osso, desfie a carne que sobrou nele e volte à panela. Acerte o sal.</p></div>'
 '<div class="mini"><p class="mt2">Rabanada do café da manhã</p><p>Reaqueça na airfryer a 180 °C por 3 a 4 minutos. Fica crocante de novo e combina com café.</p></div>'
 + tip("tip", "Dica:", "prepare marmitinhas e ofereça aos convidados no fim da noite. Todo mundo vai feliz e sobra menos para você guardar."))

FAQ = [("Posso comprar o pernil antes e congelar?", "Sim, e geralmente sai mais barato. Congele assim que chegar em casa e descongele na geladeira a partir do dia 21 (cerca de 2 dias para 3,5 kg)."),
       ("Posso assar o pernil no dia 23?", "Pode. Asse, espere amornar, fatie e guarde na geladeira com o molho. No dia 24, reaqueça coberto a 180 °C por cerca de 40 minutos. Isso libera o forno no grande dia."),
       ("Só tenho um forno pequeno. E agora?", "Faça o pernil na pressão (capítulo 5) ou asse no dia 23. Use o forno do dia 24 para a rabanada assada e o pão de alho."),
       ("Alguém não come carne de porco.", "Faça o frango com batatas como prato principal ou como segunda opção menor. Para vegetarianos, a torta de legumes e o arroz com lentilha."),
       ("Tem gente que não gosta de uva-passa.", "Sirva as passas em um potinho à parte para quem quiser colocar no arroz, na farofa e no salpicão."),
       ("Como saber se a carne está cozida sem termômetro?", "A faca entra sem esforço, o suco sai claro (sem rosado) e a carne se solta do osso. Um termômetro culinário simples é barato e tira a dúvida."),
       ("Sobrou muita comida. O que faço?", "Siga a tabela do capítulo 16, congele em porções e use as 5 receitas com sobras."),
       ("Quanto vou gastar, de verdade?", "Depende da sua cidade. Preencha a planilha do capítulo 11 com os preços da sua região e some: em poucos minutos você tem o seu número real.")]
c17 = chapter("c17", "Capítulo 17", "Dúvidas frequentes", "As perguntas que mais aparecem na hora de organizar a ceia.",
 "".join(f'<div class="faq"><p class="q">{q}</p><p>{a}</p></div>' for q, a in FAQ))

fim = chapter("fim", "Encerramento", "Seu plano em 6 passos",
 "Você já sabe planejar, comprar, cozinhar e aproveitar. Falta só colocar em prática.",
 f'<div class="totals"><div><b>~{R(ESSEN)}</b><span>Essencial</span></div><div><b>~{R(TOTAL)}</b><span>Tradicional</span></div><div><b>~{R(CAPR)}</b><span>Caprichado</span></div></div>'
 '<ol class="big"><li>Defina convidados, teto de gastos e cardápio (capítulos 1 e 2).</li><li>Ajuste as quantidades (capítulo 3) e combine quem leva o quê (capítulo 4).</li>'
 '<li>Compare preços e compre no tempo certo (capítulos 10 a 12).</li><li>No dia 23, adiante saladas, sobremesas e tempere a carne (capítulo 13).</li>'
 '<li>No dia 24, siga o cronograma hora a hora e o checklist.</li><li>No dia 25, aproveite as sobras com segurança (capítulos 14 e 16).</li></ol>'
 + tip("alert", "Avisos importantes:", "os valores são estimativas e variam por região. Confira sempre o cozimento completo das carnes, mantenha saladas com maionese refrigeradas e atenção a alergias e restrições dos convidados.")
 + '<p class="xmas">🎄 Que a sua mesa seja farta de afeto e leve no bolso. Feliz Natal! 🎄</p>')

medidas = chapter("medidas", "Apêndice", "Medidas caseiras", "Equivalências aproximadas para quem prefere pesar ou não tem os medidores à mão.",
 table(["Medida", "Equivale a"], [["1 xícara (chá)", "240 ml"], ["½ xícara (chá)", "120 ml"], ["1 colher (sopa)", "15 ml"], ["1 colher (chá)", "5 ml"],
       ["1 xícara de arroz cru", "≈ 190 g"], ["1 xícara de açúcar", "≈ 180 g"], ["1 xícara de farinha de trigo", "≈ 120 g"], ["1 xícara de farinha de mandioca", "≈ 150 g"],
       ["1 caixa de leite condensado", "395 g"], ["1 caixa de creme de leite", "200 g"], ["1 pão francês", "≈ 50 g"]])
 + '<p class="sub2">Temperaturas de forno</p>' + table(["Forno", "Temperatura"], [["Baixo", "150 a 160 °C"], ["Médio", "180 °C"], ["Médio-alto", "200 °C"], ["Alto", "220 a 230 °C"]])
 + '<p class="note">Cada forno é um forno: os tempos das receitas são referências. Confira sempre pelo ponto descrito em cada receita.</p>')

notas = f'''<section class="chap" id="notas">{tok("notas")}<p class="kick">Anotações</p><h2>Minhas anotações</h2><div class="rule"></div>
<p>Lista de convidados, ajustes de receita e o que deu certo para repetir no ano que vem.</p>{''.join('<div class="line"></div>' for _ in range(16))}</section>
<section class="chap">{''.join('<div class="line"></div>' for _ in range(22))}
<p class="copy">Ceia de Natal Econômica · Edição completa 2026 · Ebooks Práticos<br>Todos os direitos reservados. A reprodução ou o compartilhamento deste material sem autorização não são permitidos.</p></section>'''

CSS = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "estilo.css"), encoding="utf-8").read()

body = "".join([cover, dummy, toc_html(), start, intro, part1, c1, c2, c3, c4, part2, c5, c6, c7, c8, c9, part3, c10, c11, c12, part4, c13, c14, c15, c16, c17, fim, medidas, notas])
doc = f'''<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Ceia de Natal Econômica — Edição Completa</title>
<link href="https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
<style>{CSS}</style></head><body>{body}</body></html>'''
open(OUT, "w", encoding="utf-8").write(doc)
print("ok", OUT, "receitas:", len(REC), "total:", TOTAL, "essencial:", ESSEN, "caprichado:", CAPR)
