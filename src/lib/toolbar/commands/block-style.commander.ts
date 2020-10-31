import {
  BranchComponent, DivisionComponent,
  Commander,
  FormatAbstractData,
  FormatEffect, Fragment,
  BackboneComponent, CommandContext
} from '../../core/_api';
import { BlockStyleFormatter } from '../../formatter/block-style.formatter';

export class BlockStyleCommander implements Commander<string> {
  recordHistory = true;

  constructor(private name: string, private formatter: BlockStyleFormatter) {
  }

  command(context: CommandContext, value: string) {
    context.selection.ranges.forEach(range => {
      range.getSelectedScope().forEach(item => {
        let fragments: Fragment[] = [];
        if (item.fragment === range.startFragment || item.fragment === range.endFragment) {
          fragments.push(item.fragment);
        } else {
          if (item.startIndex === 0 && item.endIndex === item.fragment.contentLength) {
            fragments.push(item.fragment);
          } else {
            const ff: Fragment[] = [];
            let flag = false;
            item.fragment.sliceContents(item.startIndex, item.endIndex).forEach(content => {
              if (content instanceof DivisionComponent) {
                fragments.push(content.slot);
              } else if (content instanceof BranchComponent) {
                fragments.push(...content.slice());
              } else if (content instanceof BackboneComponent) {
                fragments.push(...Array.from(content));
              } else {
                flag = true;
              }
            })
            if (flag) {
              fragments.push(item.fragment);
            } else {
              fragments.push(...ff);
            }
          }
        }
        fragments.forEach(slot => {
          slot.apply(this.formatter, {
            state: value ? FormatEffect.Valid : FormatEffect.Invalid,
            abstractData: new FormatAbstractData({
              styles: {
                [this.name]: value
              }
            })
          });
        })
      });
    });
  }
}
