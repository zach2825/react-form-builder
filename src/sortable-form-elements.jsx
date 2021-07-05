import SortableElement from './sortable-element';
import PlaceHolder from './form-place-holder';
import BaseFormElements from './form-elements';
import {
  OneColumnRow, TwoColumnRow, ThreeColumnRow, FourColumnRow,
} from './multi-column';
import CustomElement from './form-elements/custom-element';
import BareElement from './form-elements/bare-element';

const {
  Header, Paragraph, Label, LineBreak, TextInput, NumberInput, TextArea, Dropdown, Checkboxes,
  DatePicker, RadioButtons, Image, Rating, Tags, Signature, HyperLink, Download, Camera, Range,
} = BaseFormElements;

const FormElements = {};

FormElements.Header = SortableElement(Header);
FormElements.Paragraph = SortableElement(Paragraph);
FormElements.Label = SortableElement(Label);
FormElements.LineBreak = SortableElement(LineBreak);
FormElements.TextInput = SortableElement(TextInput);
FormElements.NumberInput = SortableElement(NumberInput);
FormElements.TextArea = SortableElement(TextArea);
FormElements.Dropdown = SortableElement(Dropdown);
FormElements.Signature = SortableElement(Signature);
FormElements.Checkboxes = SortableElement(Checkboxes);
FormElements.DatePicker = SortableElement(DatePicker);
FormElements.RadioButtons = SortableElement(RadioButtons);
FormElements.Image = SortableElement(Image);
FormElements.Rating = SortableElement(Rating);
FormElements.Tags = SortableElement(Tags);
FormElements.HyperLink = SortableElement(HyperLink);
FormElements.Download = SortableElement(Download);
FormElements.Camera = SortableElement(Camera);
FormElements.Range = SortableElement(Range);
FormElements.PlaceHolder = SortableElement(PlaceHolder);
FormElements.OneColumnRow = SortableElement(OneColumnRow);
FormElements.TwoColumnRow = SortableElement(TwoColumnRow);
FormElements.ThreeColumnRow = SortableElement(ThreeColumnRow);
FormElements.FourColumnRow = SortableElement(FourColumnRow);
FormElements.CustomElement = SortableElement(CustomElement);
FormElements.BareElement = SortableElement(BareElement);

export default FormElements;
