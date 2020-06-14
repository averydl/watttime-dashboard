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
              <option value='YAD'>YAD</option>
              <option value='DEAA'>DEAA</option>
              <option value='AECI'>AECI</option>
              <option value='AVRN'>AVRN</option>
              <option value='AVA'>AVA</option>
              <option value='BANC'>BANC</option>
              <option value='BPAT'>BPAT</option>
              <option value='CISO'>CISO</option>
              <option value='HST'>HST</option>
              <option value='TPWR'>TPWR</option>
              <option value='TAL'>TAL</option>
              <option value='DUK'>DUK</option>
              <option value='FPC'>FPC</option>
              <option value='CPLE'>CPLE</option>
              <option value='CPLW'>CPLW</option>
              <option value='EPE'>EPE</option>
              <option value='EEI'>EEI</option>
              <option value='ERCO'>ERCO</option>
              <option value='FMPP'>FMPP</option>
              <option value='FPL'>FPL</option>
              <option value='GVL'>GVL</option>
              <option value='GLHB'>GLHB</option>
              <option value='GRID'>GRID</option>
              <option value='GRIF'>GRIF</option>
              <option value='ISNE'>ISNE</option>
              <option value='IPCO'>IPCO</option>
              <option value='IID'>IID</option>
              <option value='JEA'>JEA</option>
              <option value='LDWP'>LDWP</option>
              <option value='LGEE'>LGEE</option>
              <option value='MISO'>MISO</option>
              <option value='GWA'>GWA</option>
              <option value='WWA'>WWA</option>
              <option value='NEVP'>NEVP</option>
              <option value='HGMA'>HGMA</option>
              <option value='NYIS'>NYIS</option>
              <option value='NWMT'>NWMT</option>
              <option value='OVEC'>OVEC</option>
              <option value='PJM'>PJM</option>
              <option value='DOPD'>DOPD</option>
              <option value='PACE'>PACE</option>
              <option value='PACW'>PACW</option>
              <option value='PGE'>PGE</option>
              <option value='AEC'>AEC</option>
              <option value='PSCO'>PSCO</option>
              <option value='PNM'>PNM</option>
              <option value='CHPD'>CHPD</option>
              <option value='GCPD'>GCPD</option>
              <option value='PSEI'>PSEI</option>
              <option value='SRP'>SRP</option>
              <option value='SCL'>SCL</option>
              <option value='SEC'>SEC</option>
              <option value='SCEG'>SCEG</option>
              <option value='SC'>SC</option>
              <option value='SEPA'>SEPA</option>
              <option value='SOCO'>SOCO</option>
              <option value='SWPP'>SWPP</option>
              <option value='SPA'>SPA</option>
              <option value='TEC'>TEC</option>
              <option value='TVA'>TVA</option>
              <option value='TEPC'>TEPC</option>
              <option value='TIDC'>TIDC</option>
              <option value='NSB'>NSB</option>
              <option value='WALC'>WALC</option>
              <option value='WACM'>WACM</option>
              <option value='WAUW'>WAUW</option>
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
