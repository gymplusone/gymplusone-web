import {
  MenuDropdownItem,
  MenuDropdownModal,
  MenuDropdownSeparator,
  menuPanelPositionFromAnchor,
  type MenuAnchorRect,
} from '@/components/layout/MenuDropdownModal';
import { Fragment } from 'react';

export type FeedPostMoreAction = 'mute' | 'alert' | 'unmatch' | 'report';

export type FeedPostMoreMenuAnchor = MenuAnchorRect;

const ITEMS: { key: FeedPostMoreAction; label: string; danger?: boolean }[] = [
  { key: 'mute', label: 'Mute post' },
  { key: 'alert', label: 'Set alert' },
  { key: 'unmatch', label: 'Unmatch' },
  { key: 'report', label: 'Report', danger: true },
];

type FeedPostMoreMenuProps = {
  visible: boolean;
  onClose: () => void;
  onSelect?: (action: FeedPostMoreAction) => void;
  anchor: MenuAnchorRect | null;
};

export function FeedPostMoreMenu({ visible, onClose, onSelect, anchor }: FeedPostMoreMenuProps) {
  const open = visible && anchor != null;

  return (
    <MenuDropdownModal
      visible={open}
      onClose={onClose}
      panelPositionStyle={anchor != null ? menuPanelPositionFromAnchor(anchor) : {}}
    >
      {ITEMS.map((item, index) => (
        <Fragment key={item.key}>
          <MenuDropdownItem
            label={item.label}
            destructive={item.danger}
            onPress={() => {
              onSelect?.(item.key);
              onClose();
            }}
          />
          {index < ITEMS.length - 1 ? <MenuDropdownSeparator /> : null}
        </Fragment>
      ))}
    </MenuDropdownModal>
  );
}
