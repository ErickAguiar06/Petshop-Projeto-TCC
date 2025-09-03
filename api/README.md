# Instalação do Prisma 

```bash
cd api
npm i prisma -g 
npm init -y
npm i express cors dotenv
npx prisma init --datasource-provider mysql
```

# Baixe todas as dependencias de uma vez
```bash
npm install express cors dotenv prisma jsonwebtoken nodemailer stripe bcrypt
```

# Necessário
- Altere o endereço do arquivo **.env** para:   
```js
STRIPE_SECRET_KEY=(chave secreta da conta Stripe)
DATABASE_URL="mysql://root@localhost:3306/petshop?schema=public&timezone=UTC"
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_USER=petshop4patas.oficial01@gmail.com
EMAIL_PASS=###########

```
# Se necessário use:
```bash
npx prisma generate
```

# Migrations
- Faremos a migração do banco de dados para o MySQL através do comando a seguir no terminal
```bash
npx prisma migrate dev --name init
```

# Para adicionar os produtos no banco
```bash
npx prisma db seed
```

# Rodar o servidor 
```bash
npx nodemon
```