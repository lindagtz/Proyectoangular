var app = angular.module('Prueba', []);
app.controller('Trabajo1', function ($scope, $http) {
    $scope.nombre1="'cero'";
    $scope.nombre="";
    $scope.apellido="";
    $scope.id_cliente_editar="";
    $scope.id_cliente_eliminar="";
    $scope.nombreEdit= "";
    $scope.apellidoEdit= "";

    $scope.consulta_clientes=function(){
        $http({
            url: "/buscar_clientes",
            method: "post",
            params: {},
            //
        }).then(function successCallback(result){
            $scope.Clientes_consulta= result.data['resultado_consulta'];
        
        })
    }
    $scope.consulta_clientes();
    $scope.confirma_edicion=function(){
     //validar que los campos no esten vacios
        if($scope.id_cliente_editar){
            $http({
                url: "/confirmar_edicion",
                method: "post",
                params: {id_cliente:$scope.id_cliente_editar,nombre:$scope.nombreEdit,apellido:$scope.apellidoEdit},
                //
            }).then(function successCallback(result){
                if(result.data['check']){
                   $scope.MensajeActualizado= result.data['resultado_consulta'];
                   $('#cierramodal' ).click()
                   alert('si se actualizo')
                    $scope.id_cliente_editar="";
                    $scope.nombreEdit="";
                    $scope.apellidoEdit="";
                    $scope.consulta_clientes()
                }else{
                $.alert(result.data['message'], "Se actualizo perfectamente");

            }
            }) 
        }else{

        }
    }
    $scope.mostrarEdicion=function(id_cliente){
        alert(id_cliente)
        $http({
            url: "/mostrar_edicion_cliente",
            method: "post",
            params: {id_cliente:id_cliente},
            //
        }).then(function successCallback(result){
            if(result.data['message']==true){
                $scope.nombreEdit= result.data['nombre'];
                $scope.apellidoEdit= result.data['apellido'];
                $scope.id_cliente_editar=result.data['id_cliente']
            }else{
                $scope.errorEdicion=result.data['message']
            }
        })
    }

    $scope.mostrarEliminar=function(id_cliente_eliminar){
        alert(id_cliente_eliminar)
        $http({
            url: "/mostrar_edicion_cliente",
            method: "post",
            params: {id_cliente:id_cliente_eliminar}
        }).then(function successCallback(result){
            if(result.data['message']==true){
                $scope.nombreEdit= result.data['nombre'];
                $scope.apellidoEdit= result.data['apellido'];
                $scope.id_cliente_eliminar=result.data['id_cliente']
            }else{
                $scope.errorEdicion=result.data['message']
            }
        })
    }

    //eliminar lendabeybys
    $scope.confirma_delete=function(id_cliente_eliminar){
        alert('lkdsfkl '+$scope.id_cliente_eliminar)
        if($scope.id_cliente_eliminar){
            $http({
                url: "/confirmar_delete",
                method: "delete",
                params: {id_cliente:$scope.id_cliente_eliminar}
            }).then(function successCallback(result){
                if(result.data['check']){
                   $scope.MensajeBorrar= result.data['resultado_consulta'];
                   $('#modal-container-221607' ).click()
                   alert('se borro')
                    $scope.id_cliente_eliminar="";
                    $scope.consulta_clientes()
                }else{
                $.alert(result.data['message'], "Se borro perfectamente");
            }
            }) 
        }else{

        }
    }


    $scope.RegCliente=function(){
        
        if($scope.nombre==""|| $scope.apellido==""){
            $scope.ErrorRegistroCliente=true;
        }else{
            $scope.ErrorRegistroCliente=false;
            $http({
                url: "/registra_usuarioc",
                method: "post",
                params: {nombre:$scope.nombre, apellido:$scope.apellido},
            }).then(function successCallback(result) {
                $scope.RegistroExitoso= result.data;
                $scope.consulta_clientes()
                
            });
        }

    }
});