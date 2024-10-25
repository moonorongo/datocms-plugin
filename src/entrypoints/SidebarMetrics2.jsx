import { Canvas, Button } from 'datocms-react-ui';
import { useEffect, useState } from 'react';
import { performRequest } from '../utils/client.js';
import s from './sidebar.module.css';

export default function SidebarMetrics({ ctx }) {
  const [category, setCategory] = useState('')
  const [allCategories, setAllCategories] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const { allTestCategories } = await performRequest({
        query: `query Categories {
          allTestCategories {
            id
            slug
            title
          }
        }`,
        apiToken: '059fbadaf39fd80cdb1c120b37f97b'
      })

      const filteredCategories = allTestCategories.find(({id}) => id === ctx.formValues.test_category)
      
      setAllCategories(allTestCategories)
      setCategory(filteredCategories?.slug)
    }


    fetchData(); 
  }, [])


  useEffect(() => {
    const filteredCategories = allCategories.find(({id}) => id === ctx.formValues.test_category)
    setCategory(filteredCategories?.slug)
  }, [ctx.formValues.test_category])


  return <Canvas ctx={ctx}>
    preview url: {`http://localhost:3000/real-estate/${category}/${ctx.formValues.slug}?preview=true`} 
    <br />
    <Button buttonType="primary">
      <a 
        href={`http://localhost:3000/real-estate/${category}/${ctx.formValues.slug}?preview=true`} 
        target='_blank'
        className={s.link}>
          Preview
      </a>
    </Button>
  </Canvas>;
}