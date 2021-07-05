/* eslint-disable camelcase */
import React, { useEffect, useState, useMemo } from 'react';

import ComponentHeader from '../form-elements/component-header';
import ComponentLabel from '../form-elements/component-label';
import Dustbin from './dustbin';
import ItemTypes from '../ItemTypes';
import store from '../stores/store';

const accepts = [ItemTypes.BOX, ItemTypes.CARD];

const MultiColumnRow = (props) => {
  const {
    controls,
    data,
    editModeOn,
    getDataById,
    setAsChild,
    removeChild,
    seq,
    className,
    index,
  } = props;


  const { childItems, pageBreakBefore } = data;
  let baseClasses = 'SortableItem rfb-item';
  if (pageBreakBefore) { baseClasses += ' alwaysbreak'; }

  const filteredMappedItems = !editModeOn
    ? childItems.filter(x => !!x)
    : childItems;

  return (
    <div className={baseClasses}>
      <ComponentHeader {...props} />
      <div>
        <ComponentLabel {...props} />
        <div className="row">
          {filteredMappedItems.map((x, i) => (
            <div key={`${i}_${x || '_'}`} className={className}>{
              controls ? controls[i] :
                <Dustbin
                  style={{ width: '100%' }}
                  data={data}
                  accepts={accepts}
                  items={filteredMappedItems}
                  col={i}
                  parentIndex={index}
                  editModeOn={editModeOn}
                  _onDestroy={() => removeChild(data, i)}
                  getDataById={getDataById}
                  setAsChild={setAsChild}
                  seq={seq}
                />}
            </div>))}
        </div>
      </div>
    </div>
  );
}

const OneColumnRow = (props) => {
  const { data, class_name, _onUpdateOrder, ...rest } = props;

  const {
    onDuplicate: onDuplicate1= () => console.log('fail2'),
  } = props;

  const {
    onDuplicate: onDuplicate2 = () => console.log('fail1'),
  } = rest;

  const { editModeOn = false } = rest;
  const [colData, setColData] = useState(data);
  const className = class_name || 'col-md-12';

  console.log({data,className, rest, props});

  if (!data.childItems) {
    // eslint-disable-next-line no-param-reassign
    data.childItems = [null];
    data.isContainer = true;
  }

  const addAnotherInput = () => {
    console.log('all the clicking!', {data,className, rest, props});

    onDuplicate1();
    onDuplicate2();

    if (editModeOn) {
      data.childItems.push(null);
      _onUpdateOrder();
      setColData({ ...data });
      // store.dispatch('updateOrder', data);
    } else {
      // duplicate the whole element maybe use a callback. This duplication only
      // happens so an array of answers can be collected.
    }
  };

  const cleanUp = () => {
    data.childItems = data.childItems.filter(c => c);
    _onUpdateOrder();
    setColData({ ...data });
  }

  const hasEmpties = useMemo(() => {
    return colData.childItems.filter(c => !c).length>0;
  }, [colData]);

  return (
    <div>
      <button type="button" onClick={addAnotherInput}>
        {editModeOn ? 'add another input' : '+'}
      </button>
      {editModeOn && hasEmpties && <button type="button" onClick={cleanUp}>cleanup empty</button>}
      {!editModeOn && data.buttons && data.buttons.map(b => {
        console.log('OneColumnRow', {b});
        return React.createElement(b.type, b.props)
      }) }
      <MultiColumnRow {...rest} className={className} data={colData} />
    </div>
  );
};

const TwoColumnRow = ({ data, class_name, ...rest }) => {
  const className = class_name || 'col-md-6';
  if (!data.childItems) {
    // eslint-disable-next-line no-param-reassign
    data.childItems = [null, null]; data.isContainer = true;
  }
  return (
    <MultiColumnRow {...rest} className={className} data={data} />
  );
};

const ThreeColumnRow = ({ data, class_name, ...rest }) => {
  const className = class_name || 'col-md-4';
  if (!data.childItems) {
    // eslint-disable-next-line no-param-reassign
    data.childItems = [null, null, null]; data.isContainer = true;
  }
  return (
    <MultiColumnRow {...rest} className={className} data={data} />
  );
};

const FourColumnRow = ({ data, class_name, ...rest }) => {
  const className = class_name || 'col-md-3';
  if (!data.childItems) {
    // eslint-disable-next-line no-param-reassign
    data.childItems = [null, null, null, null];
    data.isContainer = true;
  }
  return <MultiColumnRow {...rest} className={className} data={data} />;
};

export {
 OneColumnRow, TwoColumnRow, ThreeColumnRow, FourColumnRow, MultiColumnRow,
};
