export const helpers = {
  status_btn(symbol) {
    if (symbol == "Not Applicable")
      return 'btn btn-info'
    else if (symbol == 'Open')
      return 'btn btn-danger'
    else if (symbol == 'Not A Finding')
      return 'btn btn-success'
    else if (symbol == 'Not Reviewed')
      return 'btn btn-warning'
    else
      return 'btn btn-info'
  },
  rowHtml(item) {
    var table_rows = '<tr><td class="details-control"><button class="' + helpers.status_btn(item.status) + '" style="width:120px">' + item.status + '</td>'
      + '<td>' + item.gid + '</td><td>' + item.rule_title + '</td><td>' + item.severity + '</td><td>' + item.nist +'</td></tr>';
    return table_rows;
  },
  format ( control_id ) {
    return 'Full name: <br>'+ control_id;
        'Salary: <br>'+
        'The child row can contain any data you wish, including links, images, inner tables etc.';
  },
  detailsPanel(d) {
    // 'd' is the original data object for the row
    var details_panel = '';
    details_panel +=
    '<ul class="nav nav-tabs" id="myTab" role="tablist">' +
      '<li class="nav-item">' +
        '<a class="nav-link active" id="findings-tab" data-toggle="tab" href="#findings" role="tab" aria-controls="findings" aria-selected="true">Finding Details</a>' +
      '</li>' +
      '<li class="nav-item">' +
        '<a class="nav-link" id="details-tab" data-toggle="tab" href="#details" role="tab" aria-controls="details" aria-selected="false">Details</a>' +
      '</li>' +
      '<li class="nav-item">' +
        '<a class="nav-link" id="code-tab" data-toggle="tab" href="#code" role="tab" aria-controls="code" aria-selected="false">InSpec Code</a>' +
      '</li>' +
    '</ul>' +
    '<div class="tab-content id="myTabContent">' +
      '<div id="findings" class="tab-pane fade show active" role="tabpanel" aria-labelledby="findings-tab">' +
        '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
          '<tr>'+
            '<td>'+d.finding_details.replace(/(?:\r\n|\r|\n)/g, '<br>')+'</td>'+
          '</tr>'+
        '</table>'+
      '</div>'+
      '<div class="tab-pane fade" id="details" role="tabpanel" aria-labelledby="details-tab">'+
        '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">';
          //Mandatory feilds
          details_panel += '<tr>'+ '<td>Control:</td>'+ '<td>'+d.vuln_num     +'</td>'+ '</tr>';
          details_panel += '<tr>'+ '<td>Title:</td>'  + '<td>'+d.rule_title   +'</td>'+ '</tr>';
          details_panel += '<tr>'+ '<td>Desc:</td>'   + '<td>'+d.vuln_discuss +'</td>'+ '</tr>';

          var DATA_NOT_FOUND_MESSAGE = 'N/A';
          // Optional Tags
          if (d.severity      != DATA_NOT_FOUND_MESSAGE) { details_panel += '<tr>'+ '<td>Severity:</td>'  + '<td>'+d.severity     +'</td>'+ '</tr>'; }
          if (d.impact        != DATA_NOT_FOUND_MESSAGE) { details_panel += '<tr>'+ '<td>Impact:</td>'    + '<td>'+d.impact       +'</td>'+ '</tr>'; }
          if (d.nist          != DATA_NOT_FOUND_MESSAGE) { details_panel += '<tr>'+ '<td>Nist Ref:</td>'  + '<td>'+d.nist         +'</td>'+ '</tr>'; }
          if (d.rationale     != DATA_NOT_FOUND_MESSAGE) { details_panel += '<tr>'+ '<td>Rationale:</td>' + '<td>'+d.rationale    +'</td>'+ '</tr>'; }
          if (d.cis_family    != DATA_NOT_FOUND_MESSAGE) { details_panel += '<tr>'+ '<td>CIS family:</td>'+ '<td>'+d.cis_family   +'</td>'+ '</tr>'; }
          if (d.cis_rid       != DATA_NOT_FOUND_MESSAGE) { details_panel += '<tr>'+ '<td>CIS rid:</td>'   + '<td>'+d.cis_rid      +'</td>'+ '</tr>'; }
          if (d.cis_level     != DATA_NOT_FOUND_MESSAGE) { details_panel += '<tr>'+ '<td>CIS level:</td>' + '<td>'+d.cis_level    +'</td>'+ '</tr>'; }
          if (d.check_content != DATA_NOT_FOUND_MESSAGE) { details_panel += '<tr class="overflow-wrap">'+ '<td>Check Text:</td>'+ '<td>'+d.check_content+'</td>'+ '</tr>'; }
          if (d.fix_text      != DATA_NOT_FOUND_MESSAGE) { details_panel += '<tr>'+ '<td>Fix Text:</td>'  + '<td>'+d.fix_text     +'</td>'+ '</tr>'; }

          details_panel +=
        '</table>'+
      '</div>'+
      '<div class="tab-pane fade" id="code" role="tabpanel" aria-labelledby="code-tab">'+
        '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
          '<tr>'+
            '<td><pre id="precode" class="line-numbers"><code id="code" class="language-ruby">'+ d.code +'</code></pre></td>'+
          '</tr>'+
        '</table>'+
      '</div>' +
    '</div>';

    return details_panel;
  }

}
