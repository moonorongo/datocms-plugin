import { Canvas, Button } from 'datocms-react-ui';
import { useEffect, useState, useCallback } from 'react';
import { performRequest } from '../utils/client.js';
import s from './sidebar.module.css';

export default function SidebarMetrics({ ctx, localSettings }) {
  const [allCategories, setAllCategories] = useState([])
  const [previewUrl, setPreviewUrl] = useState('')
  const [liveUrl, setLiveUrl] = useState('')
  const globalConfig = JSON.parse(ctx.plugin.attributes.parameters.globalConfig)
  
  // PREVIEW
  const buildPreviewUrl = useCallback((filteredCategories) => {
    let output = localSettings.preview.link

    output = output.replace('%GLOBAL_PREVIEW_BASE_URL%', globalConfig.GLOBAL_PREVIEW_BASE_URL)
    filteredCategories && (output = output.replace(localSettings.queries[0].token, filteredCategories?.slug))
    output = output.replace('%slug%', ctx.formValues.slug)
    output = output.replace('%GLOBAL_PREVIEW_SECRET%', globalConfig.GLOBAL_PREVIEW_SECRET)

    return output
  })

  // LIVE
  const buildLiveUrl = useCallback((filteredCategories) => {
    let output = localSettings.live.link

    output = output.replace('%GLOBAL_LIVE_BASE_URL%', globalConfig.GLOBAL_LIVE_BASE_URL)
    filteredCategories && (output = output.replace(localSettings.queries[0].token, filteredCategories?.slug))
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

      // build urls
      setPreviewUrl(buildPreviewUrl(filteredCategories))
      setLiveUrl(buildLiveUrl(filteredCategories))
    }

    if(localSettings?.queries) {
      fetchData(); 
    }
  }, [])


  useEffect(() => {
    const filteredCategories = allCategories.find(({id}) => id === ctx.formValues[localSettings.queries[0].fieldId])
   
    // build urls
    setPreviewUrl(buildPreviewUrl(filteredCategories))
    setLiveUrl(buildLiveUrl(filteredCategories))
  }, [
    localSettings?.queries? ctx.formValues[localSettings.queries[0].fieldId] : null,
    ctx.formValues.slug
  ])



  return <Canvas ctx={ctx}>
    <Button buttonType="primary">
      <a 
        href={previewUrl} 
        target='_blank'
        className={s.link}>
          {globalConfig.GLOBAL_PREVIEW_TEXT}
      </a>
    </Button>

    <br />
    <br />
    <Button buttonType="primary">
      <a 
        href={liveUrl} 
        target='_blank'
        className={s.link}>
          {globalConfig.GLOBAL_LIVE_TEXT}
      </a>
    </Button>

  </Canvas>;
}