/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */


import React from 'react'
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';


export const ToggleButton = (
        {onClick, className='btn btn-sm btn-default', label, style, disabled, icon}) => {
    const buttonStyle = Object.assign({}, style ? style : {});
    return (
        <button onClick={onClick}
            className={className}
            style={buttonStyle}
            disabled={disabled}>
            {icon}
            {label}
        </button>
    )
};
ToggleButton.propTypes = {
    onClick: PropTypes.func,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.object,]),
    style: PropTypes.object,
    disabled: PropTypes.bool,
    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.object,]),
};


export const ButtonLabel = ({label, value, icon}) => {
    return <span>
        {label} {value ? '(' + value + ')' : ''} {icon}
    </span>
};
ButtonLabel.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.number,
    icon: PropTypes.object,
};


// Based on https://github.com/ngokevin/react-file-reader-input
export class FileReaderInput extends React.Component {
  static propTypes = {
    as: PropTypes.oneOf(['binary', 'buffer', 'text', 'url']),
    children: PropTypes.any,
    onChange: PropTypes.func,
  };
  constructor(props) {
    // FileReader compatibility warning.
    super(props);

    const win = typeof window === 'object' ? window : {};
    if ((typeof window === 'object') && (!win.File || !win.FileReader || !win.FileList || !win.Blob)) {
      console.warn(
        '[react-file-reader-input] Some file APIs detected as not supported.' +
        ' File reader functionality may not fully work.'
      );
    }
  }
  handleChange = e => {
    const files = [];
    for (let i = 0; i < e.target.files.length; i++) {
      // Convert to Array.
      files.push(e.target.files[i]);
    }
    // See: https://facebook.github.io/react/docs/events.html#event-pooling
    e.persist();

    // Build Promise List, each promise resolved by FileReader.onload.
    Promise.all(files.map(file => new Promise((resolve) => {
      let reader = new FileReader();

      reader.onload = result => {
        // Resolve both the FileReader result and its original file.
        resolve([result, file]);
      };

      // Read the file with format based on this.props.as.
      switch ((this.props.as || 'url').toLowerCase()) {
        case 'binary': {
          reader.readAsBinaryString(file);
          break;
        }
        case 'buffer': {
          reader.readAsArrayBuffer(file);
          break;
        }
        case 'text': {
          reader.readAsText(file);
          break;
        }
        case 'url': {
          reader.readAsDataURL(file);
          break;
        }
      }
    })))
    .then(zippedResults => {
      // Run the callback after all files have been read.
      this.props.onChange(e, zippedResults);
    });
  };
  triggerInput = () => {
    ReactDOM.findDOMNode(this._reactFileReaderInput).click();
  };
  render() {
    const hiddenInputStyle = this.props.children ? {
      // If user passes in children, display children and hide input.
      position: 'absolute',
      top: '-9999px'
    } : {};

    return <div className="_react-file-reader-input"
                onClick={this.triggerInput}>
      <input {...this.props} children={undefined} type="file"
             onChange={this.handleChange} ref={c => this._reactFileReaderInput = c}
             style={hiddenInputStyle}/>

      {this.props.children}
    </div>
  }
}
