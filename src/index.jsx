import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import * as Styles from './styles';

const DATA_SELECT_KEY = 'data-select-key';

const DragSelection = ({
  children, isEnable = true, style, boxStyle,
  onSelectedItems,
}) => {
  const wrapper = useRef();
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [mouseDownWithMetaKey, setMouseDownWithMetaKey] = useState(false);
  const [boxPosition, setBoxPosition] = useState({
    top: 0,
    height: 0,
    left: 0,
    width: 0,
  });
  const [startPosition, setStartPosition] = useState({
    clientX: 0,
    clientY: 0,
  });
  const [startOffsetTop, setStartOffsetTop] = useState(0);
  const isSelectBoxRendered = useMemo(
    () => boxPosition.width !== 0 || boxPosition.height !== 0,
    [boxPosition],
  );

  const initSelection = () => {
    setBoxPosition({
      top: 0,
      height: 0,
      left: 0,
      width: 0,
    });
    setStartPosition({
      clientX: 0,
      clientY: 0,
    });
    setStartOffsetTop(0);
    setIsSelecting(false);
  };

  const isInSelectBox = useCallback((
    childItem,
  ) => {
    const {
      top, height, left, width,
    } = boxPosition;
    const {
      top: childTop, height: childHeight,
      left: childLeft, width: childWidth,
    } = childItem.getBoundingClientRect();
    const scrollDiff = startOffsetTop - wrapper.current.getBoundingClientRect().top;

    return left <= childLeft + childWidth
      && left + width >= childLeft
      && top <= childTop - startOffsetTop + childHeight + scrollDiff
      && top + height >= childTop - startOffsetTop + scrollDiff;
  }, [wrapper, boxPosition, startOffsetTop]);

  const isClicked = useCallback((
    childItem,
  ) => {
    const { clientY, clientX } = startPosition;
    const {
      top: childTop, height: childHeight,
      left: childLeft, width: childWidth,
    } = childItem.getBoundingClientRect();

    return clientX >= childLeft
      && clientX <= childLeft + childWidth
      && clientY >= childTop
      && clientY <= childTop + childHeight;
  }, [startPosition]);

  const isMetaKeyPressed = (e) => e.metaKey || e.ctrlKey || e.shiftKey;

  const setNewerSelectedItems = useCallback((items) => {
    if (mouseDownWithMetaKey) {
      // 기존에 선택 되었던 키가 중복으로 영역안에 들어가면 제거 하고 기존 선택 되었던 키와 합치기
      // 메타키가 눌려있는 채로 영역을 선택 했기 때문
      setSelectedItems([...selectedItems, ...items.filter(item => !selectedItems.includes(item))]);
      return;
    }

    setSelectedItems([...items]);
  }, [mouseDownWithMetaKey, selectedItems]);

  const handleMouseLeave = () => initSelection();

  const handleMouseUp = useCallback(() => {
    const items = [];
    wrapper.current.childNodes.forEach((childNode) => {
      const childElement = childNode.querySelector(`[${DATA_SELECT_KEY}]`);

      // children 중에서 DATA_SELECT_KEY를 가지고 있는 dom 에 접근하여 그 dom에 위치와 간격을 기준으로 셀렉트 시킬지 판단
      if (!childElement) return;
      if (isInSelectBox(childElement) || isClicked(childElement)) {
        items.push(childElement.getAttribute(DATA_SELECT_KEY));
      }
    });

    setNewerSelectedItems(items);
    initSelection();
  }, [wrapper, isSelectBoxRendered, isInSelectBox, isClicked, setNewerSelectedItems]);

  const handleMouseMove = useCallback((e) => {
    const { clientX, clientY } = e;
    const { clientX: startX, clientY: startY } = startPosition;

    const scrollDiff = startOffsetTop - wrapper.current.getBoundingClientRect().top;
    setBoxPosition({
      top: Math.min(startY, clientY + scrollDiff) - startOffsetTop,
      height: Math.abs(startY - (clientY + scrollDiff)),
      left: Math.min(startX, clientX) - wrapper.current.offsetLeft,
      width: Math.abs(startX - clientX),
    });
  }, [startPosition, startOffsetTop]);

  const handleMouseDown = useCallback((e) => {
    const { clientX, clientY } = e;
    setStartPosition({ clientX, clientY });
    setStartOffsetTop(window.pageYOffset + wrapper.current.getBoundingClientRect().top);
    setIsSelecting(true);
    setMouseDownWithMetaKey(false);

    if (isMetaKeyPressed(e)) {
      setMouseDownWithMetaKey(true);
      return;
    }

    if (selectedItems.length === 0) {
      return;
    }

    setSelectedItems([]);
  }, [wrapper, selectedItems]);

  useEffect(() => {
    if (wrapper && isSelecting && isEnable) {
      const { current } = wrapper;
      current.addEventListener('mousemove', handleMouseMove);
      current.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      if (wrapper) {
        const { current } = wrapper;
        current.removeEventListener('mousemove', handleMouseMove);
        current.removeEventListener('mouseup', handleMouseUp);
      }
    };
  }, [wrapper, isSelecting, isEnable, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    if (selectedItems && isEnable && onSelectedItems) {
      onSelectedItems([...selectedItems]);
    }
  }, [selectedItems]);

  useEffect(() => {
    if (!isEnable) {
      setSelectedItems([]);
    }
  }, [isEnable]);

  return (
    <Styles.Wrapper
      ref={wrapper}
      styles={style}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isEnable && <Styles.Selection boxStyle={boxPosition} />}
    </Styles.Wrapper>
  );
};

export default DragSelection;
