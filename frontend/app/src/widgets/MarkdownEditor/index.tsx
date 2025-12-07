import React from 'react';
import remarkBreaks from "remark-breaks";
import MDEditor, { commands } from '@uiw/react-md-editor';
import './index.css';

type MarkdownEditorWidgetProps = {
  value: string;
  onChange: (value: string) => void;
  height?: string;
};

const MarkdownEditorWidget: React.FC<MarkdownEditorWidgetProps> = ({
  value,
  onChange,
  height = '400px',
}) => {
  const handleChange = (val?: string) => {
    onChange(val || '');
  };

  return (
    <div className="markdownEditorContainer">
      <MDEditor
        value={value}
        onChange={handleChange}
        height={height}
         previewOptions={{
           remarkPlugins: [remarkBreaks],
        }}
        commands={[
          commands.bold,
          commands.italic,
          commands.strikethrough,
          commands.hr,
          commands.divider,
          commands.title1,
          commands.title2,
          commands.link,
          commands.quote,
          commands.codeBlock,
          commands.table,
          commands.orderedListCommand,
          commands.unorderedListCommand,
	        commands.image,
        ]}
      />
    </div>
  );
};

export default MarkdownEditorWidget;
