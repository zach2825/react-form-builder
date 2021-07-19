import React, { useMemo } from 'react';
import FormElements from './form-elements';
import MultiColumns from './multi-column/MultiColumnRow';
import CustomElement from './form-elements/custom-element';
import BareElement from './form-elements/bare-element';
import Registry from './stores/registry';

const {
  Image, Checkboxes, Signature, Download, Camera,
} = FormElements;

const ReactFormWithContext = (props) => {
  const {
    data,
    read_only,
    download_path,
    formContext,
  } = props;
  const {
    form,
    setForm,
    onChange: ctxOnChange,
    getValue,
    editing: ctxEditing,
    shouldShow: ctxShouldShow,
  } = formContext;
  const inputs = {};

  const onChange = (e) => {
    const { target: { name, value, ...others } } = e;

    ctxOnChange(e);
  };

  const _getDefaultValue = (item) => {
    return form[item.field_name];
  };

  const _optionsDefaultValue = (item) => {
    const defaultValue = _getDefaultValue(item);
    if (defaultValue) {
      return defaultValue;
    }

    const defaultChecked = [];
    item.options.forEach(option => {
      if (form[`option_${option.key}`]) {
        defaultChecked.push(option.key);
      }
    });
    return defaultChecked;
  };

  const getDataById = (id) => {
    return data.find(x => x.id === id);
  };

  const getInputElement = (
    item, { inContainer = false, index = null } = {}) => {
    const newItems = { ...item };

    if (index !== null) {
      newItems.custom_name += `[${index}]`;
    }

    if (newItems.custom) {
      return getCustomElement(newItems);
    }

    if (newItems.bare) {
      return getBareElement(newItems);
    }

    const Input = FormElements[newItems.element];

    return (
      <Input
        handleChange={onChange}
        ref={c => inputs[newItems.field_name] = c}
        mutable={true}
        key={`form_${newItems.id}`}
        data={newItems}
        read_only={read_only}
        defaultValue={_getDefaultValue(newItems)}
      />
    );
  };

  const getContainerElement = (
    item, Element, { allowDuplicate = false } = {}) => {
    const { props, custom_name, name } = item;
    const { customRule } = props || {};

    console.log({ ctxEditing, customRule, item });

    if (!ctxEditing && customRule && !ctxShouldShow(customRule)) {
      return null;
    }

    let thisGroupValues = getValue(custom_name || name, '');

    if (!thisGroupValues.length) {
      thisGroupValues = [{}];
    }

    return thisGroupValues.map((groupValues, groupIndex) => {
      const controls = item.childItems.map((x, index) => {
        if (!x) {
          return <div style={{ display: 'none' }}>&nbsp;</div>;
        }

        return getInputElement(getDataById(x));
      });

      return (
        <Element
          mutable={true}
          key={`form_${item.id}`}
          data={item}
          controls={controls}
        />
      );
    });
  };

  const getSimpleElement = (item) => {
    const Element = FormElements[item.element];
    return (<Element mutable={true} key={`form_${item.id}`} data={item} />);
  };

  const getCustomElement = (item) => {
    if (!item.component || typeof item.component !== 'function') {
      item.component = Registry.get(item.key);
      if (!item.component) {
        console.error(`${item.element} was not registered`);
      }
    }

    const inputProps = item.forwardRef && {
      handleChange: onChange,
      defaultValue: _getDefaultValue(item),
      ref: c => inputs[item.field_name] = c,
    };

    return (
      <CustomElement
        mutable={true}
        read_only={read_only}
        key={`form_${item.id}`}
        data={item}
        {...inputProps}
      />
    );
  };

  const getBareElement = (item) => {
    if (!item.component || typeof item.component !== 'function') {
      item.component = Registry.get(item.key);
      if (!item.component) {
        console.error(`${item.element} was not registered`);
      }
    }

    const inputProps = item.forwardRef && {
      handleChange: onChange,
      defaultValue: _getDefaultValue(item),
      ref: c => inputs[item.field_name] = c,
    };

    return (
      <BareElement
        mutable={true}
        read_only={read_only}
        key={`form_${item.id}`}
        data={item}
        {...inputProps}
      />
    );
  };

  let data_items = data;

  const items = useMemo(() => {
    return data_items.filter(x => !x.parentId).map(item => {
      if (!item) return null;
      switch (item.element) {
        case 'TextInput':
        case 'NumberInput':
        case 'TextArea':
        case 'Dropdown':
        case 'DatePicker':
        case 'RadioButtons':
        case 'Rating':
        case 'Tags':
        case 'Range':
          return getInputElement(item);
        case 'CustomElement':
          return getCustomElement(item);
        case 'BareElement':
          return getBareElement(item);
        case 'FourColumnRow':
        case 'ThreeColumnRow':
        case 'TwoColumnRow':
          return getContainerElement(item, MultiColumns[item.element]);
        case 'OneColumnRow':
          return getContainerElement(item, MultiColumns[item.element],
            { allowDuplicate: true });
        case 'Signature':
          return <Signature
            ref={c => inputs[item.field_name] = c}
            read_only={read_only || item.readOnly} mutable={true}
            key={`form_${item.id}`} data={item}
            defaultValue={_getDefaultValue(item)} />;
        case 'Checkboxes':
          return <Checkboxes
            ref={c => inputs[item.field_name] = c}
            read_only={read_only} handleChange={onChange}
            mutable={true} key={`form_${item.id}`} data={item}
            defaultValue={_optionsDefaultValue(item)} />;
        case 'Image':
          return <Image
            ref={c => inputs[item.field_name] = c}
            handleChange={onChange} mutable={true}
            key={`form_${item.id}`} data={item}
            defaultValue={_getDefaultValue(item)} />;
        case 'Download':
          return <Download
            download_path={download_path} mutable={true}
            key={`form_${item.id}`} data={item} />;
        case 'Camera':
          return <Camera
            ref={c => inputs[item.field_name] = c}
            read_only={read_only || item.readOnly} mutable={true}
            key={`form_${item.id}`} data={item}
            defaultValue={_getDefaultValue(item)} />;
        default:
          return getSimpleElement(item);
      }
    });
  }, [data_items, form]);

  return (<>{items}</>);
};

export default ReactFormWithContext;
