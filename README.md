# Ingamana Preview

  Permite agregar botones de previsualizacion de contenidos (Preview y Live). El plugin esta inspirado en "Sidebar Link Buttons", por lo que se configura de una forma similar, con los agregados propios de mi parte


## Configuracion General
  
  Aqui podemos definir las etiquetas globales que vamos a utilizar en la configuracion particular de cada Model.
  Una configuracion base es la siguiente:
```
    { 
      "GLOBAL_PREVIEW_TEXT": "Preview", 
      "GLOBAL_LIVE_TEXT": "Live", 
      "GLOBAL_PREVIEW_BASE_URL": "http://localhost:3000", 
      "GLOBAL_PREVIEW_SECRET": "<secret_word_goes_here>", 
      "GLOBAL_LIVE_BASE_URL": "http://localhost:3000", 
      "CMS_DATOCMS_API_TOKEN": "<graphql_cms_token>" 
    }
```

  **GLOBAL_PREVIEW_TEXT**: La etiqueta que se muestra en el boton "Preview"

  **GLOBAL_LIVE_TEXT**: La etiqueta que se muestra en el boton "Live"

  **GLOBAL_PREVIEW_BASE_URL**: La url base que tendra el boton Preview

  **GLOBAL_LIVE_BASE_URL**: La url base que tendra el boton Live

  **GLOBAL_PREVIEW_SECRET**: palabra secreta que utilizaremos para el preview (si consideramos utilizarla)

  **CMS_DATOCMS_API_TOKEN**: el token de acceso a la API de graphql del cms, necesario por si necesitamos realizar alguna consulta


## Configuracion Particular de cada Model

  Para tener la opcion de Preview en un Model especifico hay que agregar un field del tipo "JSON", especificarle un Title y Field Id, y en el tab "Presentation" seleccionar en Field Editor la opcion "Ingamana Preview".
  Esto nos desplegara una caja de texto para poder configurar las opciones disponibles para el Model

  **Una configuracion basica puede ser la siguiente**
```
    { 
      "preview": {
        "link": "%GLOBAL_PREVIEW_BASE_URL%/%slug%?secret=%GLOBAL_PREVIEW_SECRET%&preview=true"
      },

      "live": {
        "link": "%GLOBAL_LIVE_BASE_URL%/%slug%"
      }
    }
```

  aqui *%GLOBAL_PREVIEW_BASE_URL%*, *%GLOBAL_LIVE_BASE_URL%* y *%GLOBAL_PREVIEW_SECRET%* los toma de la configuracion general, en tanto que *%slug%* lo toma del field "slug" que tenemos que tener definido en el Model


  **Una configuracion mas compleja podria necesitar la propiedad "queries":**

    Si tenemos un caso en el que la url depende de una categoria (que especificamos con un field del tipo Single Link), entonces podemos agregar una propiedad "queries" en la que especificamos:
    
      - fieldId: el field id del selector de categorias
      - query: la query en graphql, que nos trae todos los modelos que tendra el selector de categorias (mas adelante detallamos)
      - token: el token que utilizaremos para reemplazar en la url el valor seleccionado por el usuario

    entonces, si tenemos en el Model un field del tipo Single Link que enlaza a otro Model de nombre "Test Category", y tiene un field id "test_category", entonces podemos configurarlo de la siguiente manera:

```
      { 
        "queries": [
          {
            "fieldId" : "test_category",
            "query" : "query Categories { items:allTestCategories { id  slug }}",
            "token" : "%CATEGORY%"
          }
        ],

        "preview": {
          "link": "%GLOBAL_PREVIEW_BASE_URL%/real-estates/%CATEGORY%/%slug%?secret=%GLOBAL_PREVIEW_SECRET%&preview=true"
        },

        "live": {
          "link": "%GLOBAL_LIVE_BASE_URL%/real-estates/%CATEGORY%/%slug%?secret=%GLOBAL_PREVIEW_SECRET%"
        }
      }
```
    con esta configuracion queda expuesto en %CATEGORY% el slug de la "Test Category" que hayamos elegido en el field "test_category"