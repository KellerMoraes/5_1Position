FROM node

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia apenas os arquivos de dependência primeiro (melhor para cache)
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código

# Expõe a porta padrão do Vite (5173)
EXPOSE 5173

# Comando padrão para iniciar o servidor de desenvolvimento
CMD ["npm", "run", "dev", "--", "--host"]
