import type { RenderConfigScreenCtx } from 'datocms-plugin-sdk';
import { Canvas, ContextInspector, Form, TextareaField, FieldGroup, Button } from 'datocms-react-ui';
import s from './styles.module.css';

type FreshInstallationParameters = {};
type ValidParameters = { globalConfig: string };
type Parameters = FreshInstallationParameters | ValidParameters;

type Props = {
  ctx: RenderConfigScreenCtx;
};

function updateSettings(ctx : RenderConfigScreenCtx) {
  const form = document.querySelector('.form-settings') as HTMLFormElement;
  const data = new FormData(form)

  ctx.updatePluginParameters({ globalConfig: data.get('globalConfig') });
  ctx.notice('Settings updated successfully!');
}


export default function ConfigScreen({ ctx }: Props) {
  const parameters = ctx.plugin.attributes.parameters as Parameters;
  
  return (
    <Canvas ctx={ctx}>
      <p>Example:</p>
      <pre  className='sample'>
        <code>
          {'{'} <br />
            "GLOBAL_PREVIEW_TEXT": "Preview", <br />
            "GLOBAL_LIVE_TEXT": "Live", <br />
            "GLOBAL_PREVIEW_BASE_URL": "http://localhost:3000", <br />
            "GLOBAL_PREVIEW_SECRET": "character2024", <br />
            "GLOBAL_LIVE_BASE_URL": "http://localhost:3000", <br />
            "CMS_DATOCMS_API_TOKEN": "" <br />
          {'}'}
        </code>
      </pre>

      <Form className="form-settings" onSubmit={() => updateSettings(ctx)}>
        <FieldGroup>
          <textarea
            required
            name="globalConfig"
            id="globalConfig"
            className={s.textarea}
            // @ts-ignore:
            defaultValue={parameters.globalConfig}
          ></textarea>
        </FieldGroup>
        <FieldGroup>
          <Button type='submit' fullWidth buttonType="primary">
            Update
          </Button>
        </FieldGroup>
      </Form>


      <div className={s.inspector}>
        <ContextInspector />
      </div>
    </Canvas>
  );
}
