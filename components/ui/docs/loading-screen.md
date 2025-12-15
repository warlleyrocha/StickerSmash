# LoadingScreen - Componente de Tela de Carregamento

## 📋 Descrição

Componente reutilizável para exibir uma tela de loading em toda a aplicação. Centraliza o indicador de carregamento com uma mensagem opcional.

## 🎨 Uso

### Importação

```tsx
import LoadingScreen from "@/components/ui/loading-screen";
```

### Exemplos de Uso

#### Básico (sem props)
```tsx
function MeuComponente() {
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  return <View>...</View>;
}
```
**Resultado**: Exibe "Carregando..." com indicador grande roxo (#4F46E5)

#### Com mensagem personalizada
```tsx
<LoadingScreen message="Verificando autenticação..." />
```

#### Com cor personalizada
```tsx
<LoadingScreen 
  message="Salvando dados..." 
  color="#10B981" 
/>
```

#### Com tamanho pequeno
```tsx
<LoadingScreen 
  message="Aguarde..." 
  size="small" 
/>
```

#### Sem mensagem
```tsx
<LoadingScreen message="" />
```
ou
```tsx
<LoadingScreen message={undefined} />
```

## 🔧 Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `message` | `string` | `"Carregando..."` | Mensagem exibida abaixo do indicador |
| `color` | `string` | `"#4F46E5"` | Cor do indicador (Indigo-600) |
| `size` | `"small" \| "large"` | `"large"` | Tamanho do indicador |

## 💡 Onde Usar

### ✅ Casos Recomendados

1. **Verificação de Autenticação**
   ```tsx
   if (isLoading) {
     return <LoadingScreen message="Verificando autenticação..." />;
   }
   ```

2. **Carregamento de Dados**
   ```tsx
   if (isFetchingData) {
     return <LoadingScreen message="Carregando dados..." />;
   }
   ```

3. **Processamento Assíncrono**
   ```tsx
   if (isSaving) {
     return <LoadingScreen message="Salvando..." />;
   }
   ```

4. **Splash Screen Customizada**
   ```tsx
   if (!fontsLoaded) {
     return <LoadingScreen message="Preparando aplicação..." />;
   }
   ```

### ❌ Quando NÃO Usar

- Para loading em botões (use `ActivityIndicator` inline)
- Para loading em listas (use skeleton ou spinner na lista)
- Para feedback de ações rápidas (< 500ms)

## 🎯 Atualmente Usado Em

- **[app/_layout.tsx](../../../app/_layout.tsx)**: Verificação de autenticação no `AppNavigator`
- **[app/index.tsx](../../../app/index.tsx)**: Verificação inicial de autenticação na tela de login

## 🎨 Customização

### Cores Comuns

```tsx
// Sucesso (verde)
<LoadingScreen color="#10B981" />

// Aviso (amarelo)
<LoadingScreen color="#F59E0B" />

// Erro (vermelho)
<LoadingScreen color="#EF4444" />

// Padrão (roxo)
<LoadingScreen color="#4F46E5" />
```

## 📝 Estrutura do Componente

```tsx
<View className="flex-1 items-center justify-center bg-white">
  <ActivityIndicator size={size} color={color} />
  {message && (
    <Text className="mt-4 font-inter-medium text-lg text-gray-600">
      {message}
    </Text>
  )}
</View>
```

## 🔄 Evolução Futura

Possíveis melhorias:
- Adicionar animação personalizada
- Suporte a logo/imagem customizada
- Progresso percentual
- Modo escuro automático
- Timeout com mensagem de erro
