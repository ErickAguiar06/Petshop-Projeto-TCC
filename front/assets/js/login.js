const uri = 'http://localhost:3000'; 

async function loginUsuario(email, senha) {
    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });
        const data = await response.json();
        if (response.ok && data.token) {
            localStorage.setItem('token', data.token);
            window.location.href = 'produtos.html'; // Redireciona para página de produtos
        } else {
            alert(data.message || 'Email ou senha inválidos.');
        }
    } catch (err) {
        alert('Erro ao fazer login.');
    }
}

function login() {
    const form = document.querySelector('#formLogin');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const dados = {
            email: form.email.value,
            senha: form.senha.value,
        };
        try {
            const response = await fetch(`${uri}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token); // Salva o token
                alert('Login bem-sucedido!');
                window.location.href = '../index.html';
            } else {
                alert(data.message || 'Email ou senha inválidos.');
            }
        } catch (err) {
            alert('Erro ao fazer login.');
        }
    });
}

// Animação da label
document.querySelectorAll('.user-box input').forEach(input => {
    if (input.value !== "") input.classList.add('not-empty');
    input.addEventListener('input', () => {
        if (input.value !== "") {
            input.classList.add('not-empty');
        } else {
            input.classList.remove('not-empty');
        }
    });
});


const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");
const container = document.getElementById("container");

signUpButton.addEventListener("click", () => {
  container.classList.add("right-panel-active");
});

signInButton.addEventListener("click", () => {
  container.classList.remove("right-panel-active");
});

// Cadastro
document.getElementById("formCadastro").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = e.target.nome.value;
  const email = e.target.email.value;
  const telefone = e.target.telefone.value; // Adicionado telefone
  const senha = e.target.senha.value;

  try {
    const response = await fetch("http://localhost:3000/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, telefone, senha }), // Incluído telefone
    });

    const data = await response.json();
    if (response.ok) {
      alert("Usuário cadastrado com sucesso!");
      const container = document.getElementById("container");
      container.classList.remove("right-panel-active");
    } else {
      alert(data.message || "Erro ao cadastrar.");
    }
  } catch (err) {
    console.error("Erro ao cadastrar:", err);
    alert("Erro ao cadastrar.");
  }
});

document.addEventListener('DOMContentLoaded', login);
