import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import axios from "axios";
import Swal from 'sweetalert2'

class SoftwareList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            responseSwtoolList: '',
            append_SwtoolList: '',
        }
    }

    componentDidMount() {
        this.callSwToolListApi()
    }

    callSwToolListApi = async () => {
        axios.post('/api/Swtool?type=list', {
        })
        .then( response => {
            try {
                this.setState({ responseSwtoolList: response });
                this.setState({ append_SwtoolList: this.SwToolListAppend() });
            } catch (error) {
                alert('작업중 오류가 발생하였습니다.');
            }
        })
        .catch( error => {alert('작업중 오류가 발생하였습니다.');return false;} );
    }

    SwToolListAppend = () => {
        let result = []
        var SwToolList = this.state.responseSwtoolList.data
        
        for(let i=0; i<SwToolList.json.length; i++){
            var data = SwToolList.json[i]

            var date = data.reg_date
            var year = date.substr(0,4)
            var month = date.substr(4,2)
            var day = date.substr(6,2)
            var reg_date = year +'.'+month+'.'+day

            result.push(
                <tr class="hidden_type">
                    <td>{data.swt_toolname}</td>
                    <td>{data.swt_function}</td>
                    <td>{reg_date}</td>
                    <td>
                        <Link to={'/SoftwareView/'+data.swt_code} 
                        className="bt_c1 bt_c2 w50_b">수정</Link>
                        <a href="#n" class="bt_c1 w50_b" id={data.swt_code}
                        onClick={(e) => this.deleteSwtool(e)}>삭제</a>
                    </td>
                </tr>
            )
        }
        return result
    }

    deleteSwtool = (e) => {
        var event_target = e.target
        this.sweetalertDelete('정말 삭제하시겠습니까?', function() {
            axios.post('/api/Swtool?type=delete', {
                is_SwtCd : event_target.getAttribute('id')
            })
            .then( response => {
                this.callSwToolListApi()
            }).catch( error => {alert('작업중 오류가 발생하였습니다.');return false;} );
        }.bind(this))
    }

    sweetalertDelete = (title, callbackFunc) => {
        Swal.fire({
            title: title,
            text: "",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
          }).then((result) => {
            if (result.value) {
              Swal.fire(
                'Deleted!',
                '삭제되었습니다.',
                'success'
              )
            }else{
                return false;
            }
            callbackFunc()
          })
    }

    render () {
        return (
            <section class="sub_wrap" >
                <article class="s_cnt mp_pro_li ct1 mp_pro_li_admin">
                    <div class="li_top">
                        <h2 class="s_tit1">Q&A</h2>
                        <div class="li_top_sch af">
                        <Link to={'/SoftwareView/register'} className="sch_bt2 wi_au">Tool 등록</Link>
                        </div>
                    </div>

                    <div class="list_cont list_cont_admin">
                        <table class="table_ty1 ad_tlist">
                            <tr>
                                <th>순번</th>
                                <th>문의내용</th>
                                <th>등록일</th>
                                <th>기능</th>
                            </tr>
                        </table>	
                        <table class="table_ty2 ad_tlist">
                            {this.state.append_SwtoolList}
                        </table>
                    </div>
                </article>
            </section>
        );
    }
}

export default SoftwareList;