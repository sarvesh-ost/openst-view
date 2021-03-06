/**
 * Created by Aniket on 26/02/18.
 */


;(function ( window, $){

  var btx  = ns("btx");

  var oThis = btx.home = {

    config: {},

    init: function ( config ) {
      var oThis = this;
      $.extend(oThis.config, config);
      oThis.googleCharts_1 = new GoogleCharts();
      oThis.googleCharts_2 = new GoogleCharts();
      oThis.bindButtons();
      oThis.triggerClick();
      oThis.initDatatable();
    },

    bindButtons: function(){

      $('.interval').on('click', function(){
        var $graphCard = $(this).closest('.card-graph');
        $graphCard.find('.interval').removeClass('active');
        $(this).addClass('active');
        if($graphCard.hasClass('graph-1')){
          oThis.printTransfersChart($(this).data('interval'));
        } else {
          oThis.printVolumeChart($(this).data('interval'));
        }

      });

    },

    triggerClick: function(){
      $('.graph-1 .interval[data-interval="Day"]').trigger('click');
      $('.graph-2 .interval[data-interval="Day"]').trigger('click');

    },

    initDatatable: function(){
      var oThis = this;
      oThis.recentTokenTransactions = new TokenTable({
        ajaxURL: oThis.config.latest_token_transfer_url,
        selector: '#homeRecentTokenTransactions',

        dtConfig : {
          columns: [
            {
              data: null,
              width:'6%',
              render: function(data, type, full, meta){
                return Handlebars.compile_fe($('#dt-col-1').text())({
                  symbol: data.company_symbol,
                  name: data.company_name,
                  symbol_icon: data.symbol_icon,
                  redirect_url:data.token_details_redirect_url
                });
              }
            },
            {
              data: null,
              width:'14%',
              render: function(data, type, full, meta){
                return Handlebars.compile_fe($('#dt-col-2-1').text())({
                  tokens: data.tokens,
                  coin_symbol: data.company_symbol,
                  value: data.ost_amount
                });
              }
            },
            {
              data: null,
              width:'14%',
              render: function(data, type, full, meta){
                return Handlebars.compile_fe($('#dt-col-2-2').text())({
                  tokens: data.tokens,
                  coin_symbol: data.company_symbol,
                  value: data.ost_amount
                });
              }
            },
            {
              data: null,
              width:'11%',
              render: function(data, type, full, meta){
                return Handlebars.compile_fe($('#dt-col-3').text())({
                  timestamp: data.timestamp
                });
              }
            },
            {
              data: null,
              width:'11%',
              render: function(data, type, full, meta){
                return Handlebars.compile_fe($('#dt-col-4').text())({
                  tx: data.transaction_hash,
                  redirect_url: data.tx_redirect_url

                });
              }
            },
            {
              data: null,
              width:'17%',
              render: function(data, type, full, meta){
                return Handlebars.compile_fe($('#dt-col-5').text())({
                  from: data.t_from,
                  redirect_url: data.from_redirect_url

                });
              }
            },
            {
              data: null,
              width:'4%',
              className: 'arrow',
              render: function(data, type, full, meta){
                return Handlebars.compile_fe($('#dt-col-6').text());
              }
            },
            {
              data: null,
              width:'17%',
              render: function(data, type, full, meta){
                return Handlebars.compile_fe($('#dt-col-7').text())({
                  to: data.t_to,
                  redirect_url: data.to_redirect_url

                });
              }
            }
          ]
        },
        responseReceived: function ( response ) {

          var dataToProceess = response.data[response.data.result_type]
          , meta =  response.data.meta
          ,contractAddresses = response.data['contract_addresses']
          ;

          dataToProceess.forEach(function(element) {

            var txHash = element.transaction_hash
            , from = element.t_from
            , to = element.t_to
            , txURL = meta.transaction_placeholder_url
            , addressURL = meta.address_placeholder_url
            , tokenDetailsURL = meta.token_details_redirect_url
            , contractAddress = element.contract_address
            , tokens = element.tokens
            , conversionRate = contractAddresses[contractAddress].conversion_rate
            , timestamp = element.timestamp
            ;

            element['timestamp'] = toTimeAgo(timestamp);

            element['tx_redirect_url'] =  Handlebars.compile(txURL)({
              tr_hash: txHash
            });

            element['from_redirect_url'] =  Handlebars.compile(addressURL)({
              address: from
            });

            element['to_redirect_url'] =  Handlebars.compile(addressURL)({
              address: to
            });

            element['token_details_redirect_url'] =  Handlebars.compile(tokenDetailsURL)({
              contract_addr: contractAddress
            });

            element['tokens'] = PriceOracle.getDisplayBt(tokens);
            element['ost_amount'] = PriceOracle.getDisplayBtToOst(tokens, conversionRate);

            element['company_name'] = contractAddresses[contractAddress].company_name;
            element['company_symbol'] = contractAddresses[contractAddress].company_symbol;
            element['symbol_icon'] = contractAddresses[contractAddress].symbol_icon;

          });
        }
      });

      oThis.topTokens = new TokenTable({
        ajaxURL: oThis.config.top_tokens_url,
        selector: '#homeTopTokens',
        dtConfig: {
          columns: [
            {
              title:'',
              data: null,
              width:'12%',
              render: function (data, type, full, meta) {
                return Handlebars.compile_fe($('#dt-tokens-col-1').text())({
                  rank: data.rank
                });
              }
            },
            {
              title:'Token',
              data: null,
              width:'22%',
              render: function (data, type, full, meta) {
                return Handlebars.compile_fe($('#dt-tokens-col-2').text())({
                  symbol: data.company_symbol,
                  name: data.company_name,
                  symbol_icon: data.symbol_icon,
                  redirect_url:data.token_details_redirect_url
                });
              }
            },
            {
              title:'Market Cap ('+oThis.config.ostCurrencySymbol+')',
              data: null,
              width:'22%',
              render: function (data, type, full, meta) {
                return Handlebars.compile_fe($('#dt-tokens-col-3').text())({
                  market_cap: data.market_cap
                });
              }
            },
            {
              title:'Price ('+oThis.config.ostCurrencySymbol+')',
              data: null,
              width:'22%',
              render: function (data, type, full, meta) {
                return Handlebars.compile_fe($('#dt-tokens-col-4').text())({
                  price: data.price
                });
              }
            },
            {
              title:'Total Volume ('+oThis.config.ostCurrencySymbol+')',
              data: null,
              width:'22%',
              render: function (data, type, full, meta) {
                return Handlebars.compile_fe($('#dt-tokens-col-5').text())({
                  circulating_supply: data.token_ost_volume
                });
              }
            }
          ],
          ordering: false
        },

        responseReceived: function ( response ) {

          var dataToProceess = response.data[response.data.result_type]
          , meta =  response.data.meta
          , contractAddresses = response.data.contract_addresses
          ;

          dataToProceess.forEach(function(element) {

            var contractAddressId = element.contract_address_id
              , contractAddress = contractAddresses[contractAddressId].contract_address
              , tokenDetailsURL = meta.token_details_redirect_url
            ;

            element['token_details_redirect_url'] =  Handlebars.compile(tokenDetailsURL)({
              contract_addr: contractAddress
            });
            var tokenOstVolume = convertToBigNumber(element.token_ost_volume)
              , marketCapInEth = PriceOracle.toEtherFromWei(element.market_cap)
              , tokenOstVolumeInEth = PriceOracle.toEtherFromWei(tokenOstVolume)
            ;
            element['token_ost_volume'] = PriceOracle.getDisplayFiat(tokenOstVolumeInEth);
            element['price'] = PriceOracle.getDisplayBtToOstPrice(element.conversion_rate);
            element['market_cap'] = PriceOracle.getDisplayFiat(marketCapInEth);

          });
        }
      });
    },

    printTransfersChart: function(interval){
      var url = oThis.config.token_transfer_graph_url+interval;
      switch(interval) {
        case 'Hour':
          var format = 'm';
          var count = 12;
          var columns_1 = {
            type: 'datetime',
            opt_label: 'Date',
            opt_id: 'timestamp'
          };
          break;
        case 'Day':
          var format = "h aa";
          var count = 12;
          var columns_1 = {
            type: 'datetime',
            opt_label: 'Date',
            opt_id: 'timestamp'
          };
          break;
        case 'Week':
          var format = 'EEE';
          var count = 7;
          var columns_1 = {
            type: 'date',
            opt_label: 'Date',
            opt_id: 'timestamp'
          };
          break;
        case 'Month':
          var format = 'd';
          var count = 15;
          var columns_1 = {
            type: 'date',
            opt_label: 'Date',
            opt_id: 'timestamp'
          };
          break;
        case 'Year':
          var format = "MMM''yy";
          var count = 12;
          var columns_1 = {
            type: 'date',
            opt_label: 'Date',
            opt_id: 'timestamp'
          };
          break;
        case 'All':
          var format = "MMM''yy";
          var count = -1;
          var columns_1 = {
            type: 'date',
            opt_label: 'Date',
            opt_id: 'timestamp'
          };
          break;
      }
      oThis.googleCharts_1.draw({
        ajax: {
          url: url
        },
        columns: [
          columns_1,
          {
            type: 'number',
            opt_label: 'Transaction Count',
            opt_id: 'token_transfers'
          }
        ],
        options: {
          series: {
            0: {
              targetAxisIndex: 0,
              labelInLegend: 'No. of Transfers',
              color: '84d1d4'
            },
            1: {
              targetAxisIndex: 1,
              labelInLegend: 'Value of Transfers',
              color: 'ff5f5a'
            }
          },
          legend: {
            position: 'none'
          },
          chartArea: {
            width: '90%',
            height: '80%',
            right: '2%'
          },
          hAxis: {
            format: format,
            gridlines: {
              color: 'transparent',
              count: count
            },
            textStyle: oThis.chartTextStyle
          },
          vAxis: {
            format: "short",
            gridlines: {
              color: 'e3eef3'
            },
            textStyle: oThis.chartTextStyle
          }
        },
        loadingHTML: "<div class='loader'></div>",
        selector: '#transactionsValue',
        type: 'LineChart'
      });
    },

    chartTextStyle: {
      color: '597a84',
      fontSize: 9
    },

    printVolumeChart: function(interval){
      var url = oThis.config.token_volume_graph_url+interval;
      switch(interval) {
        case 'Hour':
          var format = 'm';
          var count = 12;
          var columns_1 = {
            type: 'datetime',
            opt_label: 'Date',
            opt_id: 'timestamp'
          };
          break;
        case 'Day':
          var format = "h aa";
          var count = 12;
          var columns_1 = {
            type: 'datetime',
            opt_label: 'Date',
            opt_id: 'timestamp'
          };
          break;
        case 'Week':
          var format = 'EEE';
          var count = 7;
          var columns_1 = {
            type: 'date',
            opt_label: 'Date',
            opt_id: 'timestamp'
          };
          break;
        case 'Month':
          var format = 'd';
          var count = 15;
          var columns_1 = {
            type: 'date',
            opt_label: 'Date',
            opt_id: 'timestamp'
          };
          break;
        case 'Year':
          var format = "MMM''yy";
          var count = 12;
          var columns_1 = {
            type: 'date',
            opt_label: 'Date',
            opt_id: 'timestamp'
          };
          break;
        case 'All':
          var format = "MMM''yy";
          var count = -1;
          var columns_1 = {
            type: 'date',
            opt_label: 'Date',
            opt_id: 'timestamp'
          };
          break;
      }
      oThis.googleCharts_2.draw({
        ajax: {
          url: url
        },
        columns: [
          columns_1,
          {
            type: 'number',
            opt_label: 'Transaction Volume',
            opt_id: 'token_ost_volume'
          }
        ],
        options: {
          series: {
            0: {
              targetAxisIndex: 0,
              labelInLegend: 'No. of Transfers',
              color: '84d1d4'
            },
            1: {
              targetAxisIndex: 1,
              labelInLegend: 'Value of Transfers',
              color: 'ff5f5a'
            }
          },
          legend: {
            position: 'none'
          },
          chartArea: {
            width: '90%',
            height: '80%',
            right: '2%'
          },
          hAxis: {
            format: format,
            gridlines: {
              color: 'transparent',
              count: count
            },
            textStyle: oThis.chartTextStyle
          },
          vAxis: {
            format: "short",
            gridlines: {
              color: 'e3eef3'
            },
            textStyle: oThis.chartTextStyle
          }
        },
        loadingHTML: "<div class='loader'></div>",
        selector: '#transactionsVolume',
        type: 'LineChart'
      });
    }

  }
})(window, jQuery);