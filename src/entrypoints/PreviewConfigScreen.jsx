import { Canvas, Form, TextareaField } from 'datocms-react-ui';
import {  useCallback, useState } from 'react';

export default function PreviewConfigScreen({ ctx }) {
  const [formValues, setFormValues] = useState(
    ctx.parameters,
  );

  const update = useCallback((field, value) => {
    const newParameters = { ...formValues, [field]: value };

    setFormValues(newParameters);
    ctx.setParameters(newParameters);
    
  }, [formValues, setFormValues, ctx.setParameters]);

  return (
    <Canvas ctx={ctx}>
      <Form>
        <TextareaField
          rows="8"
          id="localSettings"
          name="localSettings"
          label="Local Settings"
          required
          value={formValues.localSettings}
          onChange={update.bind(null, 'localSettings')}
        />
      </Form>
    </Canvas>
  );
}