// Função para buscar endereço pelo CEP
async function buscarEndereco() {
  const cep = document.getElementById('cep').value;
  if (cep.length !== 8) return;

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();

    if (!data.erro) {
      document.getElementById('endereco').value = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
      document.getElementById('localidade').value = `${data.localidade}/${data.uf}`;
    } else {
      alert('CEP não encontrado!');
    }
  } catch (error) {
    alert('Erro ao buscar CEP.');
  }
}

// Função para carregar imagem como Base64
const loadImageAsBase64 = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => reject(`Erro ao carregar a imagem: ${url}`);
  });
};

// Função para gerar o PDF
async function gerarPDF() {
  const nome = document.getElementById('nome').value;
  const cpf = document.getElementById('cpf').value;
  const endereco = document.getElementById('endereco').value;
  const numero = document.getElementById('numero').value;
  const complemento = document.getElementById('complemento').value;
  const localidade = document.getElementById('localidade').value;
  const dataEmissao = new Date().toLocaleDateString();

  if (!nome || !cpf || !endereco || !numero || !localidade) {
    alert("Preencha todos os campos obrigatórios!");
    return;
  }

  const contratante = `${nome}, inscrito(a) no CPF sob o nº ${cpf}, residente e domiciliado(a) em ${endereco}, nº ${numero}, ${complemento}, CEP ${document.getElementById('cep').value}`;

  try {
    // Carregar a imagem de fundo como Base64
    const bgImageBase64 = await loadImageAsBase64("./bg.png");

    const docDefinition = {
      pageMargins: [30, 60, 30, 40],
      background: {
        image: bgImageBase64,
        width: 595.28,
        height: 841.89,
      },
      content: [
        { text: 'Contrato de Prestação de Serviços de Busca Genealógica', style: 'header' },
        '\n\n',
        { text: "Entre as partes:", bold: true, margin: [45, 0, 0, 0] },
        { text: '1.   Contratante:', bold: true, margin: [61, 10, 45, 0], fontSize: 13 },
        { text: `${contratante}`, margin: [80, 0, 45, 0], fontSize: 13 },
        { text: '2.   Contratada:', bold: true, margin: [61, 0, 45, 0], fontSize: 13 },
        {
          text: [
            { text: ' Imigrei Assessoria de Imigração LTDA', bold: true },
            ', inscrita no CNPJ sob o nº ',
            { text: '48.429.887/0001-64', bold: true },
            ', com sede no Brasil, localizada na Lagoa da Conceição, Florianópolis, SC, e filial na Itália, situada na Corso Vittorio Emanuele, nº 75, Soave (VR), CEP 37038, neste ato representada por sua advogada ',
            { text: 'Ana Caroline Azevedo Michelon', bold: true },
            ', brasileira e italiana, solteira, portadora da carteira de identidade nº ',
            { text: '45.661.346-8', bold: true },
            ' e inscrita no CPF sob o nº ',
            { text: '442.462.388-21', bold: true },
            ', residente e domiciliada na Via Pigna, nº 22, Soave (VR), CEP 37038.'
          ],
          fontSize: 13,
          margin: [80, 0, 45, 0],
        },
        { text: "As partes têm entre si justo e contratado o seguinte:", bold: true, style: "text" },
        { text: "__________________________________________________________________________________", margin: [45, 20, 45, 20], alignment: "center" },
        { text: 'Cláusula 1 – Objeto do Contrato', style: 'subheader' },
        {
          text: 'A Contratada compromete-se a realizar uma busca genealógica para verificar a existência de um ascendente direto do Contratante que tenha direito à cidadania italiana, conforme as informações fornecidas pelo Contratante.',
          style: "text",
        },
        { text: "__________________________________________________________________________________", margin: [45, 20, 45, 20], alignment: "center" },
        { text: 'Cláusula 2 – Condições de Pagamento', style: 'subheader' },
        {
          text: [
            { text: 'O Contratante pagará à Contratada o valor de ' },
            { text: '350 euros', bold: true },
            { text: ', caso seja identificada a existência de um ascendente que atenda aos critérios de cidadania italiana. O pagamento deve ser efetuado no mesmo dia após a Contratada apresentar as informações que confirmem a ascendência. Nenhuma informação será fornecida antes do pagamento total da busca genealógica. Caso a Contratada não identifique o ascendente, nenhuma cobrança será realizada.' }
          ],
          style: "text",
        },
        { text: "__________________________________________________________________________________", margin: [45, 20, 45, 20], alignment: "center" },
        { text: 'Cláusula 3 – Obrigações do Contratante', style: 'subheader' },
        {
          text: [
            { text: "1." },
            { text: ' O Contratante compromete-se a fornecer informações precisas e completas para a realização da busca genealógica, incluindo, mas não se limitando a:' }
          ],
          style: "list"
        },
        { text: "- Nome completo dos familiares;\n- Datas e locais de nascimento, casamento ou óbito;\n- Registros ou cidades de origem conhecidas.", fontSize: 13, margin: [80, 0, 45, 0] },
        {
          text: [
            { text: "2." },
            { text: " O Contratante declara estar ciente de que o pagamento será devido caso o ascendente seja identificado, independentemente de eventual decisão posterior de dar prosseguimento ao processo de cidadania italiana." }
          ],
          style: "list"
        },
        { text: "__________________________________________________________________________________", margin: [45, 20, 45, 20], alignment: "center" },

        { text: "Cláusula 4 – Obrigações da Contratada", style: "subheader" },
        { text: "1. A Contratada compromete-se a realizar a busca genealógica com diligência e transparência, utilizando os recursos disponíveis para localizar o ascendente.", style: "list" },
        { text: "2. Caso o ascendente seja identificado, a Contratada fornecerá ao Contratante uma comprovação documental ou relatório com as informações encontradas.", style: "list" },

        { text: "__________________________________________________________________________________", margin: [45, 20, 45, 20], alignment: "center" },

        { text: "Cláusula 5 – Rescisão e Penalidades", style: "subheader" },
        {
          text: [
            { text: "1. O descumprimento do pagamento por parte do Contratante implicará multa de " },
            { text: "2% ", bold: true },
            { text: "sobre o valor devido, além de juros de mora de " },
            { text: "1% ao mês", bold: true },
            { text: ", respeitando o limite máximo permitido pela lei." }
          ], style: "list"
        },
        { text: "2. Em caso de inadimplência, a Contratada reserva-se o direito de tomar medidas judiciais para a cobrança do valor devido.", style: "list" },

        { text: "__________________________________________________________________________________", margin: [45, 20, 45, 20], alignment: "center" },

        { text: "E por estarem justos e contratados, firmam o presente em duas vias de igual teor e forma.", margin: [45, 5, 45, 20], bold: true, fontSize: 13 },
        { text: "Disposições Gerais:", style: "text", bold: true },
        {
          text: [
            { text: "Cláusula 6: ", bold: true },
            { text: "As partes ora contratantes, nos termos do disposto no art. 24. da Lei 8.906/94, e, 784, XII, do Código de Processo Civil, elegem o presente contrato, assinado por duas testemunhas, como título executivo extrajudicial." }
          ], style: "text"
        },
        {
          text: [
            { text: "Cláusula 7: ", bold: true },
            { text: "Em caso de desistência da Ação feita por qualquer das partes litigantes, impontualidade, transação, revogação do mandato outorgado pelo Contratante ou ainda por qualquer ato deste (s) em conjunto ou outros violando o presente instrumento, reputar-se-á o mesmo vencido e exigível, sendo devidos pelo Contratante a totalidade dos honorários advocatícios que versariam sobre a ação. " }
          ], style: "text"
        },
        {
          text: [
            { text: "Foro: ", bold: true },
            { text: "Elege-se de comum acordo, o Foro da Comarca de Florianópolis/SC, para dirimir quaisquer divergências oriundas do presente contrato." }
          ], style: "text"
        },

        { text: "E por estarem justos e contratados, firmam o presente em duas vias de igual teor e forma, para surta seus jurídicos e legais efeitos. ", style: "text" },

        { text: "__________________________________________________________________________________", margin: [45, 20, 45, 20], alignment: "center" },

        {
          text: [
            { text: "Localidade: ", bold: true },
            { text: `${localidade}` }
          ], style: "text"
        },
        {
          text: [
            { text: "Data de Emissão: ", bold: true },
            { text: `${dataEmissao}` }
          ], style: "text"
        },
        "\n\n",
        { 
          text: [
            { text: "Contratante: ", bold: "true" },
            { text: "________________________________" },
          ], style: "text", alignment: "center"
        },
        { text: nome, alignment: "center" },
        
        { 
          text: [
            { text: "Contratada: ", bold: "true" },
            { text: "________________________________" },
          ], style: "text", alignment: "center"
        },
        { text: "Imigrei Assessoria de Imigração LTDA", alignment: "center" },

        { text: "__________________________________________________________________________________", margin: [45, 20, 45, 20], alignment: "center" },
      ],
      styles: {
        header: { fontSize: 16, bold: true, alignment: 'center' },
        subheader: { fontSize: 13, bold: true, margin: [45, 5, 45, 5] },
        text: { fontSize: 13, margin: [45, 15, 45, 0] },
        list: { fontSize: 13, margin: [60, 10, 45, 0] }
      }
    };

    pdfMake.createPdf(docDefinition).getBlob((blob) => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `Proposta_Genealogia_${nome}.pdf`;
      link.click();
      URL.revokeObjectURL(link.href);
    });
  } catch (error) {
    alert("Erro ao gerar o PDF.");
  }
}
