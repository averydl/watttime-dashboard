import React from 'react'
import Calendar from 'react-calendar';
import { connect } from 'react-redux';
import { chooseBA, chooseStartDay, chooseEndDay } from '../../actions/filterMenu';
import 'react-calendar/dist/Calendar.css';

class FilterWindow extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedBalancingAuthority: 'sortByBalancingAuthority',
      startDate: new Date(),
      endDate: new Date(), 
    }
  }

  balanceAuthList = [
    'YAD', 'AZPS', 'DEAA', 'AECI', 'AVRN',
    'AVA', 'BANC', 'BPAT', 'CISO', 'HST',
    'TPWR', 'TAL', 'DUK', 'FPC', 'CPLE',
    'CPLW', 'EPE', 'EEI', 'ERCO', 'FMPP',
    'FPL', 'GVL', 'GLHB', 'GRID', 'GRIF',
    'ISNE', 'IPCO', 'IID', 'JEA', 'LDWP',
    'LGEE', 'MISO', 'GWA', 'WWA', 'NEVP',
    'HGMA', 'NYIS', 'NWMT', 'OVEC', 'PJM',
    'DOPD', 'PACE', 'PACW', 'PGE', 'AEC',
    'PSCO', 'PNM', 'CHPD', 'GCPD', 'PSEI',
    'SRP', 'SCL', 'SEC', 'SCEG', 'SC',
    'SEPA', 'SOCO', 'SWPP', 'SPA', 'TEC',
    'TVA', 'TEPC', 'TIDC', 'NSB', 'WALC',
    'WACM', 'WAUW'].sort();

  handleDropDownBalancingAuthority = (e) => {
    this.setState({
      selectedBalancingAuthority: e.target.value,
    })
    console.log('You have submitted: ', e.target.value, ' balancing authority.')
  }

  onChangeStartDate = startDate => this.setState({ startDate })

  onChangeEndDate = endDate => this.setState({ endDate })

  // Apply filters
  applyFilters = (e) => {
    e.preventDefault();
    console.log(this.state);
    this.props.chooseBA(this.state.selectedBalancingAuthority);
    this.props.chooseStartDay(this.state.startDate);
    this.props.chooseEndDay(this.state.endDate);
  }

  render() {
    const balanceAuthOptions = this.balanceAuthList.map(ba => <option value={ba}>{ba}</option>);
    return (
      /* Navigation Bar */
      <div className='sidebar-navigation'>
        {/* Apply Filters Form */}
        <form onSubmit={(e) => this.applyFilters(e)}>

          {/* Calendar Start Date */}
          <h2>Select Start Date</h2>
          <div>
            <Calendar
              onChange={this.onChangeStartDate}
              value={this.state.startDate}
            />
          </div>
          
          {/* Calendar End Date */}
          <h2>Select End Date</h2>
          <div>
            <Calendar
              onChange={this.onChangeEndDate}
              value={this.state.endDate}
            />
          </div>
          
          <br></br>

          {/* Sort By Balancing Authority */}
          <div className='drop-down-balancing-authority'>
            <select
              class='block'
              value={this.state.selectedBalancingAuthority}
              onChange={(e) => this.handleDropDownBalancingAuthority(e)}
              id='sortByBalancingAuthority'
            >
              <option value='sortByBalancingAuthority'>Balancing Authority</option>
              {balanceAuthOptions}
            </select>
          </div>

          <br></br>
          
          {/* Apply Filters Button */}
          <button type='submit' class='block'>
            Apply Filters
          </button>
        </form>
      </div>
    )
  }
}

// export default FilterWindow
function mapStateToProps(reduxState){
  return {
    filterMenuData: reduxState
  };
}



// export default FilterWindow
export default connect(mapStateToProps, {chooseBA, chooseStartDay, chooseEndDay})(FilterWindow)
