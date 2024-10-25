import { Canvas, Button } from 'datocms-react-ui';
import { useEffect, useState, useCallback } from 'react';
import { performRequest } from '../utils/client.js';
import s from './sidebar.module.css';

export default function SidebarMetrics({ ctx, localSettings }) {
  const [allCategories, setAllCategories] = useState([])
  const [previewUrl, setPreviewUrl] = useState('')
  const [liveUrl, setLiveUrl] = useState('')
  const globalConfig = JSON.parse(ctx.plugin.attributes.parameters.globalConfig)
  
  const buildPreviewUrl = useCallback((filteredCategories) => {
    let output = localSettings.preview.link

    output = output.replace('%GLOBAL_PREVIEW_BASE_URL%', globalConfig.GLOBAL_PREVIEW_BASE_URL)
    output = output.replace(localSettings.queries[0].token, filteredCategories?.slug)
    output = output.replace('%slug%', ctx.formValues.slug)
    output = output.replace('%GLOBAL_PREVIEW_SECRET%', globalConfig.GLOBAL_PREVIEW_SECRET)

    return output
  })

  const buildLiveUrl = useCallback((filteredCategories) => {
    let output = localSettings.live.link

    output = output.replace('%GLOBAL_LIVE_BASE_URL%', globalConfig.GLOBAL_LIVE_BASE_URL)
    output = output.replace(localSettings.queries[0].token, filteredCategories?.slug)
    output = output.replace('%slug%', ctx.formValues.slug)
    output = output.replace('%GLOBAL_PREVIEW_SECRET%', globalConfig.GLOBAL_PREVIEW_SECRET)

    return output
  })


  useEffect(() => {
    const fetchData = async () => {
      const { items } = await performRequest({
        query: localSettings.queries[0].query,
        apiToken: globalConfig.CMS_DATOCMS_API_TOKEN
      })

      const filteredCategories = items.find(({id}) => id === ctx.formValues[localSettings.queries[0].fieldId])
      
      setAllCategories(items)

      // build preview url
      setPreviewUrl(buildPreviewUrl(filteredCategories))
    }

    if(localSettings.queries[0].query) {
      fetchData(); 
    }
  }, [])


  useEffect(() => {
    const filteredCategories = allCategories.find(({id}) => id === ctx.formValues[localSettings.queries[0].fieldId])
   
    // build preview url
    setPreviewUrl(buildPreviewUrl(filteredCategories))
  }, [ctx.formValues[localSettings.queries[0].fieldId], ctx.formValues.slug])



  return <Canvas ctx={ctx}>
    preview url: {previewUrl} 
    <br />
    <br />

    <Button buttonType="primary">
      <a 
        href={previewUrl} 
        target='_blank'
        className={s.link}>
          {globalConfig.GLOBAL_PREVIEW_TEXT}
      </a>
    </Button>

    <br />
    {/* <br />
    <Button buttonType="primary">
      <a 
        href={`http://localhost:3000/real-estate/${category}/${ctx.formValues.slug}?preview=true`} 
        target='_blank'
        className={s.link}>
          {globalConfig.GLOBAL_LIVE_TEXT}
      </a>
    </Button> */}

  </Canvas>;
}