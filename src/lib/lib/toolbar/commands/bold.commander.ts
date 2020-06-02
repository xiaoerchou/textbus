import { Commander, TBSelection, InlineFormatter, FormatEffect, FormatAbstractData, Renderer } from '../../core/_api';
import { BlockTemplate } from '../../templates/block.template';

export class BoldCommander implements Commander<InlineFormatter> {
  recordHistory = true;

  constructor(private formatter: InlineFormatter) {
  }

  command(selection: TBSelection, overlap: boolean, renderer: Renderer): void {
    selection.ranges.forEach(range => {
      const context = renderer.getContext(range.commonAncestorFragment, BlockTemplate);
      const hasContext = context && /h[1-6]/i.test(context.tagName);
      const state = hasContext ?
        (overlap ? FormatEffect.Exclude : FormatEffect.Inherit) :
        (overlap ? FormatEffect.Invalid : FormatEffect.Valid)
      range.getSelectedScope().forEach(item => {
        item.fragment.apply({
          state,
          startIndex: item.startIndex,
          endIndex: item.endIndex,
          renderer: this.formatter,
          abstractData: new FormatAbstractData({
            tag: 'strong'
          })
        });
      });
    });
  }
}