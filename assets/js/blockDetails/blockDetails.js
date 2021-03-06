/**
 * Created by Akshay on 09/03/18.
 */
;(function ( window, $) {

  var btx = ns("btx");

  var oThis = btx.blockDetails = {
    config: {},

    init: function ( config ) {
      var oThis = this;
      $.extend(oThis.config, config);

      oThis.initDatatable();
    },

    initDatatable: function() {
      var oThis = this;

      var blockDetails = new TokenTable({
        ajaxURL: oThis.config.transactions_url,
        selector: '#blockDetailsTransactions',
        //dtConfig: {
        //  columns: [
        //    {
        //      data: null,
        //      width:'16%',
        //      render: function (data, type, full, meta) {
        //        return Handlebars.compile_fe($('#dt-col-1').text())({
        //          symbol: data.company_symbol,
        //          name: data.company_name,
        //          symbol_icon: data.symbol_icon,
        //          redirect_url:data.token_details_redirect_url
        //        });
        //      }
        //    },
        //    {
        //      data: null,
        //      width:'18%',
        //      render: function (data, type, full, meta) {
        //        return Handlebars.compile_fe($('#dt-col-2').text())({
        //          tokens: data.tokens,
        //          coin_symbol: data.company_symbol,
        //          value: data.ost_amount
        //        });
        //      }
        //    },
        //    {
        //      data: null,
        //      width:'11%',
        //      render: function (data, type, full, meta) {
        //        return Handlebars.compile_fe($('#dt-col-3').text())({
        //          timestamp: data.timestamp
        //        });
        //      }
        //    },
        //    {
        //      data: null,
        //      width:'11%',
        //      render: function (data, type, full, meta) {
        //        return Handlebars.compile_fe($('#dt-col-4').text())({
        //          tx: data.transaction_hash,
        //          redirect_url: data.tx_redirect_url
        //        });
        //      }
        //    },
        //    {
        //      data: null,
        //      width:'17%',
        //      render: function (data, type, full, meta) {
        //        return Handlebars.compile_fe($('#dt-col-5').text())({
        //          from: data.t_from,
        //          redirect_url: data.from_redirect_url
        //        });
        //      }
        //    },
        //    {
        //      data: null,
        //      width:'4%',
        //      render: function (data, type, full, meta) {
        //        return Handlebars.compile_fe($('#dt-col-6').text());
        //      }
        //    },
        //    {
        //      data: null,
        //      width:'17%',
        //      render: function (data, type, full, meta) {
        //        return Handlebars.compile_fe($('#dt-col-7').text())({
        //          to: data.t_to,
        //          redirect_url: data.to_redirect_url
        //        });
        //      }
        //    }
        //  ]
        //},
        dtConfig: {
          columns: [
            {
              data: null,
              width:'6%',
              render: function (data, type, full, meta) {
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
              render: function (data, type, full, meta) {
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
              render: function (data, type, full, meta) {
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
              render: function (data, type, full, meta) {
                return Handlebars.compile_fe($('#dt-col-3').text())({
                  timestamp: data.timestamp
                });
              }
            },
            {
              data: null,
              width:'11%',
              render: function (data, type, full, meta) {
                return Handlebars.compile_fe($('#dt-col-4').text())({
                  tx: data.transaction_hash,
                  redirect_url: data.tx_redirect_url
                });
              }
            },
            {
              data: null,
              width:'17%',
              render: function (data, type, full, meta) {
                return Handlebars.compile_fe($('#dt-col-5').text())({
                  from: data.t_from,
                  redirect_url: data.from_redirect_url
                });
              }
            },
            {
              data: null,
              width:'4%',
              render: function (data, type, full, meta) {
                return Handlebars.compile_fe($('#dt-col-6').text());
              }
            },
            {
              data: null,
              width:'17%',
              render: function (data, type, full, meta) {
                return Handlebars.compile_fe($('#dt-col-7').text())({
                  to: data.t_to,
                  redirect_url: data.to_redirect_url
                });
              }
            }
          ]
        },
        responseReceived : function ( response ) {
          var dataToProceess = response.data[response.data.result_type]
            , meta =  response.data.meta
            , contractAddresses = response.data['contract_addresses']
            ;


          dataToProceess.forEach(function(element) {
            var txHash = element.transaction_hash
              ,from = element.t_from
              ,to = element.t_to
              ,txURL = meta.transaction_placeholder_url
              ,addressURL = meta.address_placeholder_url
              , tokenDetailsURL = meta.token_details_redirect_url
              ,contract_address = element.contract_address
              ,tokens = element.tokens
              ,price = contractAddresses[contract_address].conversion_rate
              ,timestamp = element.timestamp
              ;
            element['timestamp'] = toTimeAgo(timestamp);

            element['tx_redirect_url'] =  Handlebars.compile(txURL)({
              tr_hash: txHash
            });

            element['from_redirect_url'] =  Handlebars.compile(addressURL)({
              addr: from
            });
            element['to_redirect_url'] =  Handlebars.compile(addressURL)({
              addr: to
            });
            element['token_details_redirect_url'] =  Handlebars.compile(tokenDetailsURL)({
              contract_addr: contract_address
            });

            if(contract_address){

              element['tokens'] = PriceOracle.getDisplayBt(tokens);
              element['ost_amount'] = PriceOracle.getDisplayBtToOst(tokens, price);

              element['company_name'] = contractAddresses[contract_address].company_name;
              element['company_symbol'] = contractAddresses[contract_address].company_symbol;
              element['symbol_icon'] = contractAddresses[contract_address].symbol_icon;
            }else{
              element['ost_amount'] = '';
              element['company_name'] = '';
              element['company_symbol'] = '';
            }

          });
        }

      });
    }

  }
})(window, jQuery);