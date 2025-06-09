import { Node, mergeAttributes } from '@tiptap/core';

const LineHeight = Node.create({
  name: 'lineHeight',

  addGlobalAttributes() {
    return [
      {
        types: ['paragraph'],
        attributes: {
          lineHeight: {
            default: null,
            parseHTML: element => element.style.lineHeight || null,
            renderHTML: attributes => {
              if (!attributes.lineHeight) return {};
              return { style: `line-height: ${attributes.lineHeight}` };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setLineHeight:
        value =>
        ({ chain }) => {
          return chain().setNodeAttribute('paragraph', 'lineHeight', value).run();
        },
    };
  },
});

export default LineHeight;
