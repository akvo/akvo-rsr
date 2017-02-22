/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */


import { PropTypes } from 'react'


export const ToggleButton = ({onClick, label, style, disabled, icon}) => {
    const buttonStyle = Object.assign({margin: '0.3em 0.5em'}, style ? style : {});
    return (
        <button onClick={onClick}
            className={'btn btn-sm btn-default'}
            style={buttonStyle}
            disabled={disabled}>
            {icon}
            {label}
        </button>
    )
};

ToggleButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired
};
